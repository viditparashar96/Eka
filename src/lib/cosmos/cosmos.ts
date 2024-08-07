import { CosmosClient } from "@azure/cosmos";

class CosmosSingleton {
  private database: any;
  private containers: { [key: string]: any };
  private client: CosmosClient;

  constructor() {
    this.database = null;
    this.containers = {};
    this.client = new CosmosClient(process.env.COSMOSDB_CONNECTION_STRING!);
  }

  async initialize() {
    if (!this.database) {
      try {
        const databaseName = process.env.COSMOSDB_DATABASE_NAME!;
        const database = this.client.database(databaseName);
        await this.client.databases.createIfNotExists({ id: databaseName });
        this.database = database;
      } catch (error) {
        console.log("Error while initializing Cosmos database:", error);
      }
    }
  }

  async getContainer(containerName: string) {
    if (!this.database) {
      await this.initialize();
    }

    if (!this.containers[containerName]) {
      try {
        await this.database.containers.createIfNotExists({
          id: containerName,
          partitionKey: "/id",
        });
        this.containers[containerName] = this.database.container(containerName);
      } catch (error) {
        console.log("Error while creating/accessing Cosmos container:", error);
      }
    }

    return this.containers[containerName];
  }

  getDatabase() {
    return this.database;
  }
}

const cosmosSingleton = new CosmosSingleton();
export default cosmosSingleton;
