//        id INTEGER PRIMARY KEY AUTOINCREMENT,
//       title TEXT NOT NULL,
//       description TEXT,
//       deadline DATETIME,
//       status TEXT NOT NULL,
//       load DOUBLE,
//       responsible TEXT, 
//       priority TEXT DEFAULT 'haute',
//       project_id INTEGER,
//       creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//       last_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
//       last_status_change_date DATETIME 

module.exports = (db, ipcMain) => {
  
    ipcMain.handle('tasks:getAll', async () => {
      try {
        const tasks = db.prepare('SELECT * FROM tasks').all();
        return { success: true, data: tasks };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('tasks:getById', async (event, id) => {
      try {
        const task = db.prepare('SELECT * FROM tasks WHERE id = ?').get(id);
        if (!task) {
          return { success: false, error: 'Tâche introuvable' };
        }
        return { success: true, data: task };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('tasks:getByProjectId', async (event, projectId) => {
      try {
        const task = db.prepare('SELECT * FROM tasks WHERE project_id = ?').all(projectId);
        if (!task) {
          return { success: false, error: 'Tâches introuvables' };
        }
        return { success: true, data: task };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('tasks:getHighPriority', async () => {
      try {
        const tasks = db.prepare(`SELECT * FROM tasks WHERE priority = 'high'`).all();
        if (!tasks) {
          return { success: false, error: 'Aucune tâche importante' };
        }
        return { success: true, data: tasks };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('tasks:getDueSoon', async () => {
      try {
        const task = db.prepare(
          `SELECT * FROM tasks
          WHERE deadline < datetime('now', '+2 days')
          AND status != 'done'
          ORDER BY deadline ASC
        `).all();
        if (!task) {
          return { success: false, error: 'Tâches introuvables' };
        }
        return { success: true, data: task };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('tasks:create', async (event, taskData) => {
      try {
        const stmt = db.prepare('INSERT INTO tasks (title, description, deadline, status, priority, load, responsible, project_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)');
        const result = stmt.run(
            taskData.title,
            taskData.description,
            taskData.deadline,
            taskData.status,
            taskData.priority,
            taskData.load,
            taskData.responsible,
            taskData.project_id
        );
        return { success: true, data: { id: result.lastInsertRowid } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('tasks:updateTitle', async (event, id, title) => {
      return updateTitle(db, id, title);
    });
    
    ipcMain.handle('tasks:updateDescription', async (event, id, description) => {
      return updateDescription(db, id, description);
    });

    ipcMain.handle('tasks:updateDeadline', async (event, id, deadline) => {
      return updateDeadline(db, id, deadline);
    });
 
    ipcMain.handle('tasks:updateStatus', async (event, id, status) => {
        return updateStatus(db, id, status);
    });   
    
    ipcMain.handle('tasks:updatePriority', async (event, id, priority) => {
        return updatePriority(db, id, priority);
    });   
 
    ipcMain.handle('tasks:updateLoad', async (event, id, load) => {
        return updateLoad(db, id, load);
    });   
 
    ipcMain.handle('tasks:updateResponsible', async (event, id, responsible) => {
        return updateResponsible(db, id, responsible);
    }); 
    
    ipcMain.handle('tasks:updateProjectId', async (event, id, project_id) => {
        return updateProjectId(db, id, project_id);
    });
      
    ipcMain.handle('tasks:updateLastUpdateDate', async (event, id, last_update_date) => {
        return updateLastUpdateDate(db, id, last_update_date);
    });
      
    ipcMain.handle('tasks:updateLastStatusChangeDate', async (event, id, last_status_change_date) => {
        return updateLastStatusChangeDate(db, id, last_status_change_date);
    });
    
    ipcMain.handle('tasks:delete', async (event, id) => {
      try {
        const stmt = db.prepare('DELETE FROM tasks WHERE id = ?');
        const result = stmt.run(id);
        
        if (result.changes === 0) {
          return { success: false, error: 'Tâche introuvable' };
        }
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
  
    ipcMain.handle('tasks:clearAll', async () => {
      try {
        const stmt = db.prepare('DELETE FROM tasks');
        const result = stmt.run();
        
        if (result.changes === 0) {
          return { success: false, error: 'Réinitialisation échouée' };
        }
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    console.log('✅ Handlers PROJECT chargés');
  };

  
  function updateTitle(db, id, title) {
    try {
      if(title.length > 0) {
        const stmt = db.prepare('UPDATE tasks SET title = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(title, id);
        return { success: true };
      } else {
        return { success: false, error: "Le projet doit avoir un nom." };
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };
  
  function updateDescription(db, id, description) {
    try {
      const stmt = db.prepare('UPDATE tasks SET description = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
      stmt.run(description, id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  function updateDeadline(db, id, deadline) {
    try {
      const stmt = db.prepare('UPDATE tasks SET deadline = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
      stmt.run(deadline, id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  function updatePriority(db, id, priority) {
    try {
      const stmt = db.prepare('UPDATE tasks SET priority = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
      stmt.run(priority, id);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  function updateStatus(db, id, status) {
      try {
        const stmt = db.prepare('UPDATE tasks SET status = ?, last_update_date = CURRENT_TIMESTAMP, last_status_change_date = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(status, id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
  };  

  function updateLoad(db, id, load) {
      try {
        const stmt = db.prepare('UPDATE tasks SET load = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(load, id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
  };  

  function updateResponsible(db, id, responsible) {
      try {
        const stmt = db.prepare('UPDATE tasks SET responsible = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(responsible, id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
  };
  
  function updateProjectId(db, id, project_id) {
      try {
        const stmt = db.prepare('UPDATE tasks SET project_id = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(project_id, id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
  };
    
  function updateLastUpdateDate(db, id, last_update_date) {
      try {
        const stmt = db.prepare('UPDATE tasks SET last_update_date = ? WHERE id = ?');
        stmt.run(last_update_date, id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
  };
    
  function updateLastStatusChangeDate(db, id, last_status_change_date) {
      try {
        const stmt = db.prepare('UPDATE tasks SET last_status_change_date = ? WHERE id = ?');
        stmt.run(last_status_change_date, id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
  };