const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export interface Comment{
    id: string;
    content: string;
    createdAt: string;
    updatedAt: string;
    author: { id: string; name: string | null; email: string };
}
export async function createComment(taskId: string, projectId: string, content: string): Promise<Comment> {
    const response = await fetch(`${API_URL}/projects/${projectId}/tasks/${taskId}/comments`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
    });
    const result = await response.json();
    if (!response.ok) {
        console.error("createComment error:", response.status, result);
        throw new Error(result.message ?? "Failed to create comment");
    }
    return result.data.comment;
}