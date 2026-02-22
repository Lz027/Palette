const createBoard = async (name: string, color: string, template?: string): Promise<Board> => {
  if (!user) throw new Error('Not authenticated');

  // Check board count limit (optional - remove if not needed)
  const currentBoards = boards.length;
  if (currentBoards >= 50) {
    toast.error('Board limit reached (50). Delete old boards to create new ones.');
    throw new Error('Board limit reached');
  }

  const columns = template === 'kanban' 
    ? [
        { id: generateId(), title: 'To Do', cards: [] },
        { id: generateId(), title: 'In Progress', cards: [] },
        { id: generateId(), title: 'Done', cards: [] }
      ]
    : [{ id: generateId(), title: 'Tasks', cards: [] }];

  try {
    const { data, error } = await supabase
      .from('boards')
      .insert({
        name,
        color,
        columns,
        user_id: user.id,
        is_favorite: false
      })
      .select()
      .single();

    if (error) {
      console.error('Create board error:', error);
      
      // Check specific error types
      if (error.code === '42501') {
        toast.error('Permission denied. Check your login status.');
      } else if (error.code === '23505') {
        toast.error('Board with this name already exists.');
      } else if (error.code === '23514') {
        toast.error('Board limit reached for your account.');
      } else {
        toast.error(`Failed to create board: ${error.message}`);
      }
      
      throw error;
    }

    const newBoard: Board = {
      id: data.id,
      name: data.name,
      color: data.color,
      isFavorite: data.is_favorite,
      columns: data.columns,
      createdAt: new Date(data.created_at),
      userId: data.user_id
    };

    setBoards(prev => [newBoard, ...prev]);
    toast.success('Board created!');
    return newBoard;
    
  } catch (error) {
    console.error('Create board exception:', error);
    throw error;
  }
};
