"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { ModeToggle } from "@/components/theme-toggle";
import { UserMenu } from "./user-menu";
import { HistoryList } from "./history-list";

export function MobileNav() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            <div className="md:hidden flex items-center justify-between p-4 bg-background/80 backdrop-blur-xl border-b border-border sticky top-0 z-40">
                <div className="flex items-center gap-2">
                    <div className="relative w-6 h-6">
                        <Image src="/logo.svg" alt="Reality Check Logo" fill className="object-contain" />
                    </div>
                    <div className="font-bold bg-gradient-to-r from-primary to-orange-500 bg-clip-text text-transparent">
                        RealityCheck-AI
                    </div>
                </div>

                <button
                    onClick={() => setIsOpen(true)}
                    className="p-2 text-muted-foreground hover:text-foreground"
                >
                    <Menu className="w-6 h-6" />
                </button>
            </div>

            <AnimatePresence>
                {isOpen && (
                    <>
                        {/* Backdrop */}
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsOpen(false)}
                            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 md:hidden"
                        />

                        {/* Drawer */}
                        <motion.div
                            initial={{ x: "-100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "-100%" }}
                            transition={{ type: "spring", damping: 25, stiffness: 200 }}
                            className="fixed top-0 left-0 h-screen w-80 bg-background border-r border-border z-50 flex flex-col p-6 shadow-2xl md:hidden"
                        >
                            <div className="flex justify-between items-center mb-8">
                                <h2 className="text-xl font-bold text-foreground">Menu</h2>
                                <button
                                    onClick={() => setIsOpen(false)}
                                    className="p-2 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="w-6 h-6" />
                                </button>
                            </div>

                            <div className="mb-8">
                                <UserMenu />
                            </div>

                            <div className="flex-1 overflow-y-auto custom-scrollbar mb-4">
                                <HistoryList />
                            </div>

                            <div className="pt-4 border-t border-border flex items-center justify-between">
                                <span className="text-sm text-muted-foreground">Theme</span>
                                <ModeToggle />
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>
        </>
    );
}
