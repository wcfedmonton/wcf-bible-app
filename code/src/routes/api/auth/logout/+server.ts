export function POST({ cookies }) {
    cookies.delete("idToken", { path: "/" });
    cookies.delete("accessToken", { path: "/" });
    cookies.delete("refreshToken", { path: "/" });
    
    return new Response(JSON.stringify({ message: "User successfully logged out" }), {
        status: 200,
        headers: {
            "Content-Type": "application/json"
        }
    });
}