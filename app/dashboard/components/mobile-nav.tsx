"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import { UserMenu } from "./user-menu";
import { HistoryList } from "./history-list";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-black/50 backdrop-blur-xl border-b border-white/10 sticky top-0 z-50">
            <div className="font-bold bg-gradient-to-r from-amber-200 to-yellow-500 bg-clip-text text-transparent">
                RealityCheck-AI
            </div>

            <button
                onClick={() => setIsOpen(true)}
                className="p-2 text-stone-400 hover:text-white"
            >
                <Menu className="w-6 h-6" />
            </button>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-full w-80 bg-stone-950 border-r border-white/10 z-50 flex flex-col p-6 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-white">Menu</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-stone-400 hover:text-white"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <UserMenu />
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <HistoryList />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
