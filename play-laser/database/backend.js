"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var mongodb_1 = require("mongodb");
var bcrypt = require("bcryptjs");
var AuthSystem = /** @class */ (function () {
    function AuthSystem() {
        var uri = 'mongodb+srv://wendytto:CEN3907c@playzercluster.sffrt.mongodb.net/';
        this.client = new mongodb_1.MongoClient(uri, {
        // Note: Node.js MongoDB driver handles TLS/SSL certificates automatically
        // so we don't need the certifi equivalent
        });
    }
    AuthSystem.prototype.initialize = function () {
        return __awaiter(this, void 0, void 0, function () {
            var error_1;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 2, , 3]);
                        return [4 /*yield*/, this.client.connect()];
                    case 1:
                        _a.sent();
                        this.db = this.client.db('login');
                        this.collection = this.db.collection('user');
                        console.log('Connected to MongoDB');
                        return [3 /*break*/, 3];
                    case 2:
                        error_1 = _a.sent();
                        console.error('Failed to connect to MongoDB:', error_1);
                        throw error_1;
                    case 3: return [2 /*return*/];
                }
            });
        });
    };
    AuthSystem.prototype.close = function () {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.client.close()];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    AuthSystem.prototype.registerUser = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var existingUser, saltRounds, hashedPassword, userData, error_2;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 4, , 5]);
                        return [4 /*yield*/, this.collection.findOne({ username: username })];
                    case 1:
                        existingUser = _a.sent();
                        if (existingUser) {
                            console.log('Username already exists.');
                            return [2 /*return*/, false];
                        }
                        saltRounds = 10;
                        return [4 /*yield*/, bcrypt.hash(password, saltRounds)];
                    case 2:
                        hashedPassword = _a.sent();
                        userData = {
                            username: username,
                            password: hashedPassword
                        };
                        // Insert new user into collection
                        return [4 /*yield*/, this.collection.insertOne(userData)];
                    case 3:
                        // Insert new user into collection
                        _a.sent();
                        console.log('User registered successfully.');
                        return [2 /*return*/, true];
                    case 4:
                        error_2 = _a.sent();
                        console.error('Error registering user:', error_2);
                        return [2 /*return*/, false];
                    case 5: return [2 /*return*/];
                }
            });
        });
    };
    /*async authenticateUser(username: string, password: string): Promise<boolean> {
      try {
        const user = await this.collection.findOne({ username }) as UserData;
  
        if (user) {
          // Check if password matches hashed password
          const match = await bcrypt.compare(password, user.password.toString());
          if (match) {
            console.log('Login successful!');
            return true;
          } else {
            console.log('Incorrect password.');
            return false;
          }
        } else {
          console.log('User not found.');
          return false;
        }
      } catch (error) {
        console.error('Error authenticating user:', error);
        return false;
      }
    }
  }*/
    AuthSystem.prototype.authenticateUser = function (username, password) {
        return __awaiter(this, void 0, void 0, function () {
            var user, match, error_3;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        _a.trys.push([0, 5, , 6]);
                        return [4 /*yield*/, this.collection.findOne({ username: username })];
                    case 1:
                        user = _a.sent();
                        if (!(user && 'username' in user && 'password' in user)) return [3 /*break*/, 3];
                        return [4 /*yield*/, bcrypt.compare(password, user.password.toString())];
                    case 2:
                        match = _a.sent();
                        if (match) {
                            console.log('Login successful!');
                            return [2 /*return*/, true];
                        }
                        else {
                            console.log('Incorrect password.');
                            return [2 /*return*/, false];
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        console.log('User not found.');
                        return [2 /*return*/, false];
                    case 4: return [3 /*break*/, 6];
                    case 5:
                        error_3 = _a.sent();
                        console.error('Error authenticating user:', error_3);
                        return [2 /*return*/, false];
                    case 6: return [2 /*return*/];
                }
            });
        });
    };
    return AuthSystem;
}());
// Example usage
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var authSystem, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    authSystem = new AuthSystem();
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 5, 6, 8]);
                    return [4 /*yield*/, authSystem.initialize()];
                case 2:
                    _a.sent();
                    // Test registration and authentication
                    return [4 /*yield*/, authSystem.registerUser('testuser', 'mypassword')];
                case 3:
                    // Test registration and authentication
                    _a.sent();
                    return [4 /*yield*/, authSystem.authenticateUser('testuser', 'mypassword')];
                case 4:
                    _a.sent();
                    return [3 /*break*/, 8];
                case 5:
                    error_4 = _a.sent();
                    console.error('Error in main:', error_4);
                    return [3 /*break*/, 8];
                case 6: return [4 /*yield*/, authSystem.close()];
                case 7:
                    _a.sent();
                    return [7 /*endfinally*/];
                case 8: return [2 /*return*/];
            }
        });
    });
}
// Run the main function
if (require.main === module) {
    main().catch(console.error);
}
exports.default = AuthSystem;
/*import { MongoClient } from 'mongodb';
import * as bcrypt from 'bcryptjs';
import * as fs from 'fs';
import * as path from 'path';

// Connect to MongoDB
const uri = 'mongodb+srv://wendytto:CEN3907c@playzercluster.sffrt.mongodb.net/';
//const ca = [fs.readFileSync(path.resolve(__dirname, 'path/to/cert.pem'))]; // Adjust the path to your CA file
//const client = new MongoClient(uri, { tls: true, tlsCA: ca });

const caFilePath = path.resolve(__dirname, 'path/to/cert.pem');
const client = new MongoClient(uri, {
    tls: true,
    tlsCAFile: caFilePath // Correctly using tlsCAFile
});

const dbName = 'login'; // Database name
const collectionName = 'user'; // Collection name

// User registration function
async function registerUser(username: string, password: string): Promise<boolean> {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Check if username exists
    const existingUser = await collection.findOne({ username });
    if (existingUser) {
        console.log("Username already exists.");
        return false;
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // New login
    const userData = {
        username,
        password: hashedPassword,
    };

    // Insert new user into collection
    await collection.insertOne(userData);
    console.log("User registered successfully.");
    return true;
}

// User authentication function
async function authenticateUser(username: string, password: string): Promise<boolean> {
    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    const user = await collection.findOne({ username });

    if (user) {
        // Does password match hashed password?
        const isMatch = await bcrypt.compare(password, user.password);
        if (isMatch) {
            console.log("Login successful!");
            return true;
        } else {
            console.log("Incorrect password.");
            return false;
        }
    } else {
        console.log("User not found.");
        return false;
    }
}

// Test
(async () => {
    await client.connect();
    await registerUser("testuser", "mypassword");
    await authenticateUser("testuser", "mypassword");
    await client.close();
})();
*/ 
