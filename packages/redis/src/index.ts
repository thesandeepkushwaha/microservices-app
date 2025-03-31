import { createClient, RedisClientType } from "redis";
import { Logger } from "@shared/logger";

export class RedisService {
  private static instance: RedisService;
  private client: RedisClientType;
  private subscriber: RedisClientType;
  private publisher: RedisClientType;
  private logger: Logger;
  private isConnected: boolean = false;

  private constructor() {
    this.logger = new Logger("RedisService");

    // Create Redis clients but don't connect yet
    const url = process.env.REDIS_URL || "redis://localhost:6379";
    this.client = createClient({ url });
    this.subscriber = this.client.duplicate();
    this.publisher = this.client.duplicate();

    // Set up error handlers
    this.client.on("error", (err) => this.handleRedisError("client", err));
    this.subscriber.on("error", (err) =>
      this.handleRedisError("subscriber", err)
    );
    this.publisher.on("error", (err) =>
      this.handleRedisError("publisher", err)
    );
  }

  private handleRedisError(clientType: string, error: Error): void {
    this.logger.error(`Redis ${clientType} error:`, error);
    this.isConnected = false;
  }

  public static getInstance(): RedisService {
    if (!RedisService.instance) {
      RedisService.instance = new RedisService();
    }
    return RedisService.instance;
  }

  async connect(): Promise<void> {
    if (this.isConnected) {
      return;
    }

    try {
      await this.client.connect();
      await this.subscriber.connect();
      await this.publisher.connect();
      this.isConnected = true;
      this.logger.info("Connected to Redis");
    } catch (error) {
      this.logger.error("Redis connection error:", error);
      this.isConnected = false;
      throw error;
    }
  }

  async subscribe(
    channel: string,
    callback: (message: string) => void
  ): Promise<void> {
    // Ensure we're connected before subscribing
    if (!this.isConnected) {
      await this.connect();
    }

    await this.subscriber.subscribe(channel, (message) => {
      this.logger.info(`Received message on channel ${channel}`);
      callback(message);
    });
  }

  async publish(channel: string, message: string): Promise<void> {
    // Ensure we're connected before publishing
    if (!this.isConnected) {
      await this.connect();
    }

    await this.publisher.publish(channel, message);
    this.logger.info(`Published message to channel ${channel}`);
  }

  async disconnect(): Promise<void> {
    if (!this.isConnected) {
      return;
    }

    try {
      await this.client.quit();
      await this.subscriber.quit();
      await this.publisher.quit();
      this.isConnected = false;
      this.logger.info("Disconnected from Redis");
    } catch (error) {
      this.logger.error("Redis disconnection error:", error);
      throw error;
    }
  }

  get isReady(): boolean {
    return (
      this.isConnected &&
      this.publisher.isReady &&
      this.subscriber.isReady &&
      this.client.isReady
    );
  }
}
