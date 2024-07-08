import type { RequestHandler } from "@sveltejs/kit";
import fs from "node:fs"
import path from 'path';

export const GET: RequestHandler = () => {
    try {
        // Define the folder path relative to the server route file
        const folderPath = path.join(process.cwd(), '/static/audio');

        // Read the contents of the folder
        const files = fs.readdirSync(folderPath);
        

        // Return the list of files as JSON
        return new Response(
            JSON.stringify(files)
        );
    } catch (error: any) {
        // Handle errors (e.g., folder not found, permission issues)
        return new Response(
            String(error.message)
            
        )
    }
}

