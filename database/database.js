const Database = require('better-sqlite3');
const { app, ipcMain } = require('electron');
const path = require('path');

let db;

function initDatabase() {
  
  const dbPath = path.join(app.getPath('userData'), 'database.db');
  
  console.log('📁 Chemin de la base de données:', dbPath);
  console.log('📂 Dossier userData:', app.getPath('userData'));
  // Créer/ouvrir la base de données
  db = new Database(dbPath);
  
  // Créer les tables
  createTables();
  
  // Charger TOUS les handlers IPC
  loadHandlers();
}

function createTables() {
  createTableProjects();
  createTableTasks();

  displayTableStructure('projects');
  displayTableStructure('tasks');
}

function createTableProjects() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_progress_date DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
}

function createTableTasks() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS tasks (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      deadline DATETIME,
      priority TEXT DEFAULT 'high',
      status TEXT NOT NULL,
      load DOUBLE,
      responsible TEXT, 
      project_id INTEGER,
      creation_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_update_date DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_status_change_date DATETIME
    );
  `);
}


function addColumn(table, columnName, type, defaultVal = false) {
  try {
    db.prepare(`
      ALTER TABLE ${table}
      ADD COLUMN ${columnName} ${type} ${defaultVal ? "DEFAULT" + defaultVal : ""}
    `).run();
    
    console.log('✅ Colonne ajoutée avec succès');
  } catch (error) {
    console.error('❌ Erreur:', error.message);
  }
}

function displayTableStructure(tableName) {
  const columns = db.prepare(`PRAGMA table_info(${tableName})`).all();
  
  console.log(`\n📋 Structure de la table: ${tableName}`);
  console.log('─'.repeat(80));
  console.log('Nom'.padEnd(20), 'Type'.padEnd(15), 'Null?'.padEnd(10), 'Défaut'.padEnd(15), 'PK');
  console.log('─'.repeat(80));
  
  columns.forEach(col => {
    console.log(
      col.name.padEnd(20),
      col.type.padEnd(15),
      (col.notnull ? 'NOT NULL' : 'NULL').padEnd(10),
      (col.dflt_value || '-').toString().padEnd(15),
      col.pk ? '✓' : ''
    );
  });
  
  console.log('─'.repeat(80));
  console.log(`Total: ${columns.length} colonnes\n`);
}


function loadHandlers() {
  require("./ipc_handlers/handler_projects")(db, ipcMain);
  require("./ipc_handlers/handler_tasks")(db, ipcMain);
  
  console.log('✅ Tous les handlers IPC chargés');
}

function getDatabase() {
  return db;
}

function closeDatabase() {
  if (db) {
    db.close();
  }
}

module.exports = {
  initDatabase,
  getDatabase,
  closeDatabase
};
