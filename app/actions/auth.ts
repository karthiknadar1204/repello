'use server'

import { db } from "@/configs/db";
import { users } from "@/configs/schema";
import { eq } from "drizzle-orm";

type UserData = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  imageUrl: string | null;
}

export async function checkAndStoreUser(userData: UserData) {
  try {
    console.log("Received user data:", userData);
    
    if (!userData.id) {
      console.log("No userId found in userData");
      return { success: false, message: "No user ID provided" };
    }

    // Check if user already exists in database
    const existingUser = await db.query.users.findFirst({
      where: eq(users.clerkId, userData.id),
    });
    console.log("Existing user check:", existingUser);

    if (existingUser) {
      console.log("User already exists in database");
      return { success: true, message: "User already exists" };
    }

    const newUser = {
      clerkId: userData.id,
      name: `${userData.firstName} ${userData.lastName}`,
      email: userData.email,
      image: userData.imageUrl,
    };
    console.log("Attempting to store user:", newUser);

    await db.insert(users).values(newUser);
    console.log("User stored successfully");

    return { success: true, message: "User stored successfully" };
  } catch (error) {
    console.error("Error in checkAndStoreUser:", error);
    return { success: false, message: "Error processing user" };
  }
} 