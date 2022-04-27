const fs = require('fs');
const path = require('path');

const STATUS = {
  ACTIVE: 'ACTIVE',
  IN_ACTIVE: 'IN_ACTIVE',
  CHANGE_PASSWORD: 'CHANGE_PASSWORD',
};

const PERMISSIONS = {
  CREATE: 'Create',
  READ: 'Read',
  UPDATE: 'Update',
  DELETE: 'Delete',
};
const PUBLIC_FOLDER_NAME = 'public';
const UPLOADS_FOLDER_NAME = 'uploads';
const PROFILE_FOLDER_NAME = 'profiles';

const PUBLIC_FOLDER = path.join(__dirname, '../', PUBLIC_FOLDER_NAME);
const PROFILE_FOLDER = path.join(__dirname, '../', `${PROFILE_FOLDER_NAME}`);
const DELETE_FOLDER = path.join(__dirname, '../', `${UPLOADS_FOLDER_NAME}/delete`);
const UPLOAD_FOLDER = path.join(__dirname, '../', `${UPLOADS_FOLDER_NAME}/uploads`);

if (!fs.existsSync(PUBLIC_FOLDER_NAME)) {
  fs.mkdirSync(PUBLIC_FOLDER_NAME);
}

if (!fs.existsSync(UPLOADS_FOLDER_NAME)) {
  fs.mkdirSync(UPLOADS_FOLDER_NAME);
}

if (!fs.existsSync(UPLOAD_FOLDER)) {
  fs.mkdirSync(UPLOAD_FOLDER);
}

if (!fs.existsSync(DELETE_FOLDER)) {
  fs.mkdirSync(DELETE_FOLDER);
}

if (!fs.existsSync(PROFILE_FOLDER)) {
  fs.mkdirSync(PROFILE_FOLDER);
}

const globalConstants = {
  PERMISSIONS,
  STATUS,
  ADMIN_ROLE: "admin",
  UPLOADS_FOLDER_NAME,
  PUBLIC_FOLDER_NAME,
  PROFILE_FOLDER_NAME,

  ADMIN_FEATURES: [
    {
      name: "search",
      permissions: ["create", "update", "delete", "read"],
    },
    {
      name: "documents",
      permissions: ["create", "update", "delete", "read"],
    },
    {
      name: "users",
      permissions: ["create", "update", "delete", "read"],
    },
    {
      name: "events",
      permissions: ["create", "update", "delete", "read"],
    },
    {
      name: "admin",
      permissions: ["create", "update", "delete", "read"],
    },
    {
      name: "role",
      permissions: ["create", "update", "delete", "read"],
    },
  ],
};

exports.PUBLIC_FOLDER = PUBLIC_FOLDER;
exports.UPLOAD_FOLDER = UPLOAD_FOLDER;
exports.DELETE_FOLDER = DELETE_FOLDER;
exports.PUBLIC_FOLDER_NAME = PUBLIC_FOLDER_NAME;
exports.PROFILE_FOLDER_NAME = PROFILE_FOLDER_NAME;
exports.UPLOADS_FOLDER_NAME = UPLOADS_FOLDER_NAME;
module.exports = globalConstants;
