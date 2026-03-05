const { supabase, supabaseAdmin } = require("../config/supabaseClient");

// Sign up a new user
const signup = async (req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
        return res.status(400).json({ error: "Email, password and name are required" });
    }

    try {
        // Create auth user
        const { data: authData, error: authError } = await supabase.auth.signUp({
            email,
            password,
        });

        if (authError) {
            return res.status(400).json({ error: authError.message });
        }

        // Insert into users table
        const { error: insertError } = await supabaseAdmin.from("users").insert({
            id: authData.user.id,
            email,
            name,
            role: "user",
        });

        if (insertError) {
            console.error("User insert error:", insertError);
        }

        return res.status(201).json({
            message: "User registered successfully",
            user: {
                id: authData.user.id,
                email,
                name,
            },
            session: authData.session,
        });
    } catch (err) {
        console.error("Signup error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

// Login
const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: "Email and password are required" });
    }

    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return res.status(401).json({ error: error.message });
        }

        // Get user profile from users table
        const { data: profile } = await supabaseAdmin
            .from("users")
            .select("*")
            .eq("id", data.user.id)
            .single();

        return res.status(200).json({
            message: "Login successful",
            user: profile || { id: data.user.id, email: data.user.email },
            session: data.session,
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ error: "Internal server error" });
    }
};

module.exports = { signup, login };
