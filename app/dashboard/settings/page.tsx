"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";

export default function SettingsPage() {
    const { data: session } = authClient.useSession();
    const [name, setName] = useState(session?.user?.name || "");
    const [isSaving, setIsSaving] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const router = useRouter();

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        setMessage(null);

        try {
            await authClient.updateUser({
                name: name
            });
            setMessage({ type: 'success', text: 'Profile updated successfully' });
            router.refresh();
        } catch (error) {
            setMessage({ type: 'error', text: 'Failed to update profile' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white selection:bg-amber-500/30 p-6 flex flex-col items-center">
            {/* Background Ambience */}
            <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-0">
                <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-amber-900/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-orange-900/10 rounded-full blur-[120px]" />
            </div>

            <div className="w-full max-w-lg relative z-10 space-y-8 mt-12">
                <div className="flex items-center gap-4 mb-8">
                    <Link href="/dashboard" className="w-10 h-10 rounded-full bg-stone-900 border border-white/10 flex items-center justify-center hover:bg-stone-800 transition-colors">
                        ←
                    </Link>
                    <h1 className="text-2xl font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                        Account Settings
                    </h1>
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-stone-900/50 backdrop-blur-xl border border-white/10 rounded-2xl p-8"
                >
                    <div className="flex items-center gap-4 mb-8 pb-8 border-b border-white/5">
                        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl shadow-amber-900/20">
                            {session?.user?.name?.charAt(0) || "U"}
                        </div>
                        <div>
                            <p className="text-lg font-bold text-white">{session?.user?.name}</p>
                            <p className="text-sm text-stone-500">{session?.user?.email}</p>
                        </div>
                    </div>

                    <form onSubmit={handleUpdateProfile} className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-stone-400 uppercase tracking-wider">Display Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/50 outline-none transition-all placeholder:text-stone-700"
                                placeholder="Enter your full name"
                            />
                        </div>

                        {/* Password change isn't trivial with better-auth client directly without current password flow usually, 
                             so keeping it simple to Name update as requested for now */}

                        {message && (
                            <div className={`p-3 rounded-lg text-sm ${message.type === 'success' ? 'bg-green-950/30 text-green-400 border border-green-900/30' : 'bg-red-950/30 text-red-400 border border-red-900/30'}`}>
                                {message.text}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSaving}
                            className="w-full py-3 bg-gradient-to-r from-amber-500 to-orange-600 rounded-lg text-white font-bold hover:from-amber-400 hover:to-orange-500 transition-all shadow-lg shadow-amber-900/20 disabled:opacity-50"
                        >
                            {isSaving ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </motion.div>
            </div>
        </div>
    );
}
