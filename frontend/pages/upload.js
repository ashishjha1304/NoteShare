import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import UploadForm from "@/components/UploadForm";
import { isLoggedIn } from "@/services/auth";
import { HiOutlineCloudUpload } from "react-icons/hi";

export default function Upload() {
    const router = useRouter();

    useEffect(() => {
        if (!isLoggedIn()) {
            router.push("/login");
        }
    }, []);

    return (
        <>
            <Head>
                <title>Upload Notes — NoteShare</title>
                <meta name="description" content="Upload your study notes to share with fellow students." />
            </Head>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary-500/25">
                        <HiOutlineCloudUpload className="w-7 h-7 text-surface-900 dark:text-white" />
                    </div>
                    <h1 className="text-3xl font-display font-bold text-surface-900 dark:text-white">Upload Notes</h1>
                    <p className="text-surface-600 dark:text-surface-400 mt-2">Share your study materials with the community</p>
                </div>

                <div className="glass rounded-3xl p-6 sm:p-8 shadow-2xl shadow-primary-500/5">
                    <UploadForm />
                </div>
            </div>
        </>
    );
}
