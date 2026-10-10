const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
export interface Comment{
    id: string;
    content: string;
    created_at: string;
    updated_at: string;
    author: { id: string; name: string | null; email: string };
}
export async function createComment(task_id: string, project_id: string, content: string): Promise<Comment> {
    const response = await fetch(`${API_URL}/projects/${project_id}/tasks/${task_id}/comments`, {
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

export async function updateComment(task_id: string, project_id: string, commentId: string, content: string): Promise<Comment> {
    const response = await fetch(`${API_URL}/projects/${project_id}/tasks/${task_id}/comments/${commentId}`, {
        method: "PUT",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ content }),
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message ?? "Failed to update comment");
    }
    return result.data.comment;
}

export async function deleteComment(task_id: string, project_id: string, commentId: string): Promise<Comment | void> {
    const response = await fetch(`${API_URL}/projects/${project_id}/tasks/${task_id}/comments/${commentId}`, {
        method: "DELETE",
        credentials: "include",
    });
    const result = await response.json();
    if (!response.ok) {
        throw new Error(result.message ?? "Failed to delete comment");
    }
}