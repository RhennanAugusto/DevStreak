import { client, COMPLETIONS_COLLECTION_ID, DATABASE_ID, HABITS_TABLE, RealTimeResponse } from "@/lib/appwrite";

export class RealtimeController {
  private habitsChannel: string;
  private completionsChannel: string;

  constructor() {
    this.habitsChannel = `databases.${DATABASE_ID}.collections.${HABITS_TABLE}.documents`;
    this.completionsChannel = `databases.${DATABASE_ID}.collections.${COMPLETIONS_COLLECTION_ID}.documents`;
  }

  subscribeToHabits(
    onCreate: () => void,
    onUpdate: () => void,
    onDelete: () => void
  ): () => void {
    const unsubscribe = client.subscribe(
      this.habitsChannel,
      (response: RealTimeResponse) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          onCreate();
        } else if (response.events.includes("databases.*.collections.*.documents.*.update")) {
          onUpdate();
        } else if (response.events.includes("databases.*.collections.*.documents.*.delete")) {
          onDelete();
        }
      }
    );
    return unsubscribe;
  }

  subscribeToCompletions(onCreate: () => void): () => void {
    const unsubscribe = client.subscribe(
      this.completionsChannel,
      (response: RealTimeResponse) => {
        if (response.events.includes("databases.*.collections.*.documents.*.create")) {
          onCreate();
        }
      }
    );
    return unsubscribe;
  }
}

