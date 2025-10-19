const { contextBridge, ipcRenderer } = require('electron');

// Exposer l'API au frontend de manière sécurisée
contextBridge.exposeInMainWorld('app', {
  // Navigation
  navigate: (page) => ipcRenderer.invoke('navigate', page),

  // Products API
  projects: {
    getAll: () => ipcRenderer.invoke('projects:getAll'),
    getById: (id) => ipcRenderer.invoke('projects:getById', id),
    create: (projectData) => ipcRenderer.invoke('projects:create', projectData),
    updateName: (id, name) => ipcRenderer.invoke('projects:updateName', id, name),
    updateDescription: (id, description) => ipcRenderer.invoke('projects:updateDescription', id, description),
    updateProgressDate: (id) => ipcRenderer.invoke('projects:updateProgressDate', id),
    delete: (id) => ipcRenderer.invoke('projects:delete', id),
    clearAll: () => ipcRenderer.invoke('projects:clearAll')
  },

  tasks: {
    getAll: () => ipcRenderer.invoke('tasks:getAll'),
    getById: (id) => ipcRenderer.invoke('tasks:getById', id),
    getByProjectId: (projectId) => ipcRenderer.invoke('tasks:getByProjectId', projectId),
    getHighPriority: () => ipcRenderer.invoke('tasks:getHighPriority'),
    getDueSoon: () => ipcRenderer.invoke('tasks:getDueSoon'),
    create: (taskData) => ipcRenderer.invoke('tasks:create', taskData),
    updateTitle: (id, title) => ipcRenderer.invoke('tasks:updateTitle', id, title),
    updateDescription: (id, description) => ipcRenderer.invoke('tasks:updateDescription', id, description),
    updateDeadline: (id, deadline) => ipcRenderer.invoke('tasks:updateDeadline', id, deadline),
    updateStatus: (id, status) => ipcRenderer.invoke('tasks:updateStatus', id, status),
    updatePriority: (id, status) => ipcRenderer.invoke('tasks:updatePriority', id, status),
    updateLoad: (id, load) => ipcRenderer.invoke('tasks:updateLoad', id, load),
    updateResponsible: (id, responsible) => ipcRenderer.invoke('tasks:updateResponsible', id, responsible),
    updateProjectId: (id, project_id) => ipcRenderer.invoke('tasks:updateProjectId', id, project_id),
    updateLastUpdateDate: (id, date) => ipcRenderer.invoke('tasks:updateLastUpdateDate', id, date),
    updateLastStatusChangeDate: (id, date) => ipcRenderer.invoke('tasks:updateLastStatusChangeDate', id, date),
    delete: (id) => ipcRenderer.invoke('tasks:delete', id),
    deleteProjectTasks: (projectId) => ipcRenderer.invoke('tasks:deleteProjectTasks', projectId),
    clearAll: () => ipcRenderer.invoke('tasks:clearAll')
  }
});
