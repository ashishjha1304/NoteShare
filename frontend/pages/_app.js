import "@/styles/globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Toaster } from "react-hot-toast";
import Head from "next/head";
import { ThemeProvider } from "next-themes";

export default function App({ Component, pageProps }) {
    return (
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
            <Head>
                <title>NoteShare — Share & Discover Study Notes</title>
                <meta name="description" content="NoteShare is a collaborative platform for students to share, discover, and download study notes. Browse subjects, upload PDFs, rate and comment." />
                <meta name="viewport" content="width=device-width, initial-scale=1" />
                <link rel="icon" href="/favicon.png" />
            </Head>
            <div className="flex flex-col min-h-screen">
                <Navbar />
                <main className="flex-1 pt-16">
                    <Component {...pageProps} />
                </main>
                <Footer />
            </div>
            <Toaster
                position="top-right"
                toastOptions={{
                    style: {
                        background: "#1e293b",
                        color: "#f1f5f9",
                        border: "1px solid rgba(51, 65, 85, 0.5)",
                        borderRadius: "12px",
                    },
                    success: {
                        iconTheme: {
                            primary: "#6366f1",
                            secondary: "#f1f5f9",
                        },
                    },
                    error: {
                        iconTheme: {
                            primary: "#ef4444",
                            secondary: "#f1f5f9",
                        },
                    },
                }}
            />
        </ThemeProvider>
    );
}
