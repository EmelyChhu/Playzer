import { MongoClient, Collection, Db } from 'mongodb';
import * as bcrypt from 'bcryptjs';

interface UserData {
  username: string;
  password: Buffer | string;
}

class AuthSystem {
  private client: MongoClient;
  private db: Db;
  private collection: Collection;
  
  constructor() {
    const uri = 'mongodb+srv://wendytto:CEN3907c@playzercluster.sffrt.mongodb.net/';
    this.client = new MongoClient(uri, {
      // Note: Node.js MongoDB driver handles TLS/SSL certificates automatically
      // so we don't need the certifi equivalent
    });
  }

  async initialize(): Promise<void> {
    try {
      await this.client.connect();
      this.db = this.client.db('login');
      this.collection = this.db.collection('user');
      console.log('Connected to MongoDB');
    } catch (error) {
      console.error('Failed to connect to MongoDB:', error);
      throw error;
    }
  }

  async close(): Promise<void> {
    await this.client.close();
  }

  async registerUser(username: string, password: string): Promise<boolean> {
    try {
      // Check if username exists
      const existingUser = await this.collection.findOne({ username });
      if (existingUser) {
        console.log('Username already exists.');
        return false;
      }

      // Hash password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // New login
      const userData: UserData = {
        username,
        password: hashedPassword
      };

      // Insert new user into collection
      await this.collection.insertOne(userData);
      console.log('User registered successfully.');
      return true;
    } catch (error) {
      console.error('Error registering user:', error);
      return false;
    }
  }

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

async authenticateUser(username: string, password: string): Promise<boolean> {
    try {
      const user = await this.collection.findOne({ username });
      
      // Ensure user exists and matches UserData type
      if (user && 'username' in user && 'password' in user) {
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
}  

// Example usage
async function main() {
  const authSystem = new AuthSystem();
  
  try {
    await authSystem.initialize();
    
    // Test registration and authentication
    await authSystem.registerUser('testuser', 'mypassword');
    await authSystem.authenticateUser('testuser', 'mypassword');
  } catch (error) {
    console.error('Error in main:', error);
  } finally {
    await authSystem.close();
  }
}

// Run the main function
if (require.main === module) {
  main().catch(console.error);
}

export default AuthSystem;


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