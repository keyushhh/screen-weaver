import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { supabase } from "@/lib/supabase";
import bgDarkMode from "@/assets/bg-dark-mode.png";

interface LegalContent {
    content: string;
    title: string;
}

const LegalPage = ({ type }: { type: "privacy" | "terms" }) => {
    const navigate = useNavigate();
    const [data, setData] = useState<LegalContent | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchContent = async () => {
            setIsLoading(true);
            setError(null);
            const table = type === "privacy" ? "privacy_policies" : "terms_and_conditions";
            const title = type === "privacy" ? "Privacy Policy" : "Terms & Conditions";

            try {
                const { data: result, error: fetchError } = await supabase
                    .from(table)
                    .select("content")
                    .order("created_at", { ascending: false })
                    .limit(1)
                    .single();

                if (fetchError) {
                    console.error(`Error fetching ${type}:`, fetchError);
                    setError(`Failed to load ${title}. Please try again later.`);
                } else {
                    setData({
                        content: result.content,
                        title: title,
                    });
                }
            } catch (err) {
                console.error("Unexpected error:", err);
                setError("An unexpected error occurred.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchContent();
    }, [type]);

    return (
        <div
            className="h-full w-full overflow-y-auto overscroll-y-none flex flex-col safe-area-top safe-area-bottom"
            style={{
                backgroundColor: "#0a0a12",
                backgroundImage: `url(${bgDarkMode})`,
                backgroundSize: "cover",
                backgroundPosition: "top center",
                backgroundRepeat: "no-repeat",
            }}
        >
            {/* Header */}
            <div className="px-5 pt-12 flex items-center gap-3">
                <button
                    onClick={() => navigate(-1)}
                    className="w-10 h-10 rounded-full border border-white/20 flex items-center justify-center"
                >
                    <ChevronLeft className="w-5 h-5 text-foreground" />
                </button>
                <h1 className="text-foreground text-[18px] font-semibold">
                    {data?.title || (type === "privacy" ? "Privacy Policy" : "Terms & Conditions")}
                </h1>
            </div>

            {/* Content */}
            <div className="px-5 mt-8 pb-10 flex-1">
                {isLoading ? (
                    <div className="flex flex-col gap-4 animate-pulse">
                        <div className="h-4 bg-white/10 rounded w-3/4" />
                        <div className="h-4 bg-white/10 rounded w-full" />
                        <div className="h-4 bg-white/10 rounded w-full" />
                        <div className="h-4 bg-white/10 rounded w-2/3" />
                        <div className="h-4 bg-white/10 rounded w-full" />
                    </div>
                ) : error ? (
                    <div className="text-center py-10">
                        <p className="text-red-400 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-link underline"
                        >
                            Retry
                        </button>
                    </div>
                ) : (
                    <div className="prose prose-invert max-w-none">
                        <div
                            className="text-muted-foreground text-[14px] leading-relaxed whitespace-pre-wrap"
                            dangerouslySetInnerHTML={{ __html: data?.content || "" }}
                        />
                    </div>
                )}
            </div>
        </div>
    );
};

export default LegalPage;
