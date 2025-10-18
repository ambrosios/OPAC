// id INTEGER PRIMARY KEY AUTOINCREMENT,
// name TEXT NOT NULL,
// description TEXT,
// creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
// last_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
// last_progress_date DATETIME DEFAULT CURRENT_TIMESTAMP

module.exports = (db, ipcMain) => {
  
    ipcMain.handle('projects:getAll', async () => {
      try {
        const products = db.prepare('SELECT * FROM projects').all();
        return { success: true, data: products };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('projects:getById', async (event, id) => {
      try {
        const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
        if (!project) {
          return { success: false, error: 'Projet introuvable' };
        }
        return { success: true, data: project };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('projects:create', async (event, productData) => {
      try {
        const stmt = db.prepare('INSERT INTO projects (name, description) VALUES (?, ?)');
        const result = stmt.run(productData.name, productData.description || 0);
        return { success: true, data: { id: result.lastInsertRowid } };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });

    ipcMain.handle('projects:updateName', async (event, id, name) => {
      try {
        if(name.length > 0) {
          const stmt = db.prepare('UPDATE projects SET name = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
          stmt.run(name, id);
          return { success: true };
        } else {
          return { success: false, error: "Le projet doit avoir un nom." };
        }
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    ipcMain.handle('projects:updateDescription', async (event, id, description) => {
      try {
        const stmt = db.prepare('UPDATE projects SET description = ?, last_update_date = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(description, id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    ipcMain.handle('projects:updateProgressDate', async (event, id) => {
      try {
        const stmt = db.prepare('UPDATE projects SET last_progress_date = CURRENT_TIMESTAMP WHERE id = ?');
        stmt.run(id);
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    ipcMain.handle('projects:delete', async (event, id) => {
      try {
        const stmt = db.prepare('DELETE FROM projects WHERE id = ?');
        const result = stmt.run(id);
        
        if (result.changes === 0) {
          return { success: false, error: 'Projet introuvable' };
        }
        
        return { success: true };
      } catch (error) {
        return { success: false, error: error.message };
      }
    });
    
    ipcMain.handle('projects:clearAll', async () => {
      try {
        const stmt = db.prepare('DELETE FROM projects');
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

  
  