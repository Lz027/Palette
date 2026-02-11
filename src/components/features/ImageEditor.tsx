import React, { useState, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ImageIcon, Upload, Download, RotateCcw, FlipHorizontal, FlipVertical, 
  Trash2, Crop, Sun, Contrast, Droplets, Palette, Undo2, Check, X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

interface ImageEditorProps {
  className?: string;
}

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export function ImageEditor({ className }: ImageEditorProps) {
  const [image, setImage] = useState<string | null>(null);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [rotation, setRotation] = useState(0);
  const [flipH, setFlipH] = useState(false);
  const [flipV, setFlipV] = useState(false);
  const [brightness, setBrightness] = useState(100);
  const [contrast, setContrast] = useState(100);
  const [saturation, setSaturation] = useState(100);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState<{ x: number; y: number } | null>(null);
  const [cropArea, setCropArea] = useState<CropArea | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setImage(result);
      setOriginalImage(result);
      resetEdits();
    };
    reader.readAsDataURL(file);
  };

  const resetEdits = () => {
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setIsCropping(false);
    setCropArea(null);
  };

  const handleRotate = () => {
    setRotation((prev) => (prev + 90) % 360);
  };

  const handleFlipH = () => {
    setFlipH((prev) => !prev);
  };

  const handleFlipV = () => {
    setFlipV((prev) => !prev);
  };

  const handleResetFilters = () => {
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
  };

  const handleUndo = () => {
    if (originalImage) {
      setImage(originalImage);
      resetEdits();
      toast.success('Restored original image');
    }
  };

  const startCrop = () => {
    setIsCropping(true);
    setCropArea(null);
    setCropStart(null);
    toast.info('Click and drag to select crop area');
  };

  const handleCropMouseDown = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCropping || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setCropStart({ x, y });
    setCropArea({ x, y, width: 0, height: 0 });
  }, [isCropping]);

  const handleCropMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!isCropping || !cropStart || !imageContainerRef.current) return;
    
    const rect = imageContainerRef.current.getBoundingClientRect();
    const currentX = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    const currentY = Math.max(0, Math.min(e.clientY - rect.top, rect.height));
    
    const x = Math.min(cropStart.x, currentX);
    const y = Math.min(cropStart.y, currentY);
    const width = Math.abs(currentX - cropStart.x);
    const height = Math.abs(currentY - cropStart.y);
    
    setCropArea({ x, y, width, height });
  }, [isCropping, cropStart]);

  const handleCropMouseUp = useCallback(() => {
    if (!isCropping) return;
    setCropStart(null);
  }, [isCropping]);

  const applyCrop = () => {
    if (!cropArea || !image || !imageRef.current || !imageContainerRef.current) return;
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const containerRect = imageContainerRef.current!.getBoundingClientRect();
      const imgRect = imageRef.current!.getBoundingClientRect();
      
      // Calculate the actual image position within the container
      const imgOffsetX = imgRect.left - containerRect.left;
      const imgOffsetY = imgRect.top - containerRect.top;
      
      // Calculate scale between displayed image and actual image
      const scaleX = img.width / imgRect.width;
      const scaleY = img.height / imgRect.height;
      
      // Adjust crop area relative to the image element
      const cropX = Math.max(0, (cropArea.x - imgOffsetX) * scaleX);
      const cropY = Math.max(0, (cropArea.y - imgOffsetY) * scaleY);
      const cropWidth = cropArea.width * scaleX;
      const cropHeight = cropArea.height * scaleY;
      
      canvas.width = cropWidth;
      canvas.height = cropHeight;
      
      ctx.drawImage(img, cropX, cropY, cropWidth, cropHeight, 0, 0, cropWidth, cropHeight);
      
      setImage(canvas.toDataURL('image/png'));
      setIsCropping(false);
      setCropArea(null);
      toast.success('Image cropped!');
    };
    img.src = image;
  };

  const cancelCrop = () => {
    setIsCropping(false);
    setCropArea(null);
    setCropStart(null);
  };

  const handleDownload = () => {
    if (!image) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      const isRotated = rotation === 90 || rotation === 270;
      canvas.width = isRotated ? img.height : img.width;
      canvas.height = isRotated ? img.width : img.height;

      ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`;
      ctx.save();
      ctx.translate(canvas.width / 2, canvas.height / 2);
      ctx.rotate((rotation * Math.PI) / 180);
      ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);
      ctx.drawImage(img, -img.width / 2, -img.height / 2);
      ctx.restore();

      const link = document.createElement('a');
      link.download = 'edited-image.png';
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Image downloaded!');
    };
    img.src = image;
  };

  const handleClear = () => {
    setImage(null);
    setOriginalImage(null);
    resetEdits();
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const transformStyle = {
    transform: `rotate(${rotation}deg) scaleX(${flipH ? -1 : 1}) scaleY(${flipV ? -1 : 1})`,
    filter: `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%)`,
  };

  return (
    <Card className={cn("glass-card", className)}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center gap-2 text-sm font-medium">
          <ImageIcon className="h-4 w-4" />
          Quick Image Edit
        </CardTitle>
      </CardHeader>
      <CardContent className="p-3 space-y-3">
        <Input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {!image ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "border-2 border-dashed border-muted-foreground/25 rounded-lg",
              "p-6 text-center cursor-pointer hover:border-primary/50 transition-colors"
            )}
          >
            <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Click to upload an image</p>
            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, GIF up to 10MB</p>
          </div>
        ) : (
          <>
            {/* Image Preview */}
            <div 
              ref={imageContainerRef}
              className={cn(
                "relative aspect-video bg-muted/50 rounded-lg overflow-hidden flex items-center justify-center",
                isCropping && "cursor-crosshair"
              )}
              onMouseDown={handleCropMouseDown}
              onMouseMove={handleCropMouseMove}
              onMouseUp={handleCropMouseUp}
              onMouseLeave={handleCropMouseUp}
            >
              <img
                ref={imageRef}
                src={image}
                alt="Editing"
                style={transformStyle}
                className="max-w-full max-h-full object-contain transition-all"
                draggable={false}
              />
              
              {/* Crop overlay */}
              {isCropping && cropArea && cropArea.width > 0 && cropArea.height > 0 && (
                <>
                  <div className="absolute inset-0 bg-black/50 pointer-events-none" />
                  <div
                    className="absolute border-2 border-primary bg-transparent pointer-events-none"
                    style={{
                      left: cropArea.x,
                      top: cropArea.y,
                      width: cropArea.width,
                      height: cropArea.height,
                      boxShadow: `0 0 0 9999px rgba(0,0,0,0.5)`,
                    }}
                  />
                </>
              )}
            </div>

            {/* Crop confirmation buttons */}
            {isCropping && (
              <div className="flex gap-2 justify-center">
                <Button size="sm" onClick={applyCrop} disabled={!cropArea || cropArea.width < 10} className="h-8">
                  <Check className="h-3 w-3 mr-1" />
                  Apply Crop
                </Button>
                <Button size="sm" variant="outline" onClick={cancelCrop} className="h-8">
                  <X className="h-3 w-3 mr-1" />
                  Cancel
                </Button>
              </div>
            )}

            {/* Tabs for different edit options */}
            {!isCropping && (
              <Tabs defaultValue="transform" className="w-full">
                <TabsList className="w-full grid grid-cols-2 bg-muted/80">
                  <TabsTrigger value="transform" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-foreground">Transform</TabsTrigger>
                  <TabsTrigger value="adjust" className="text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-foreground">Adjust</TabsTrigger>
                </TabsList>
                
                <TabsContent value="transform" className="mt-2 space-y-2">
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" onClick={handleRotate} className="h-8">
                      <RotateCcw className="h-3 w-3 mr-1" />
                      Rotate
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleFlipH} className="h-8">
                      <FlipHorizontal className="h-3 w-3 mr-1" />
                      Flip H
                    </Button>
                    <Button size="sm" variant="outline" onClick={handleFlipV} className="h-8">
                      <FlipVertical className="h-3 w-3 mr-1" />
                      Flip V
                    </Button>
                    <Button size="sm" variant="outline" onClick={startCrop} className="h-8">
                      <Crop className="h-3 w-3 mr-1" />
                      Crop
                    </Button>
                  </div>
                </TabsContent>
                
                <TabsContent value="adjust" className="mt-2 space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Sun className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs w-16">Brightness</span>
                      <Slider
                        value={[brightness]}
                        onValueChange={(v) => setBrightness(v[0])}
                        min={0}
                        max={200}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs w-8 text-right">{brightness}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Contrast className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs w-16">Contrast</span>
                      <Slider
                        value={[contrast]}
                        onValueChange={(v) => setContrast(v[0])}
                        min={0}
                        max={200}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs w-8 text-right">{contrast}%</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Droplets className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs w-16">Saturation</span>
                      <Slider
                        value={[saturation]}
                        onValueChange={(v) => setSaturation(v[0])}
                        min={0}
                        max={200}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-xs w-8 text-right">{saturation}%</span>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost" onClick={handleResetFilters} className="h-7 text-xs">
                    <Palette className="h-3 w-3 mr-1" />
                    Reset Filters
                  </Button>
                </TabsContent>
              </Tabs>
            )}

            {/* Action buttons */}
            {!isCropping && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-border/50">
                <Button size="sm" variant="default" onClick={handleDownload} className="h-8">
                  <Download className="h-3 w-3 mr-1" />
                  Save
                </Button>
                <Button size="sm" variant="outline" onClick={handleUndo} className="h-8">
                  <Undo2 className="h-3 w-3 mr-1" />
                  Undo All
                </Button>
                <Button size="sm" variant="ghost" onClick={handleClear} className="h-8 text-destructive">
                  <Trash2 className="h-3 w-3 mr-1" />
                  Clear
                </Button>
              </div>
            )}
          </>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </CardContent>
    </Card>
  );
}