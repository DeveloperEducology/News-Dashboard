import React, { useState, useEffect, useCallback } from "react";

// --- Data for Prompt Templates ---
const promptTemplates = [
  {
    title: "సాధారణ వార్తా కథనం",
    style: "Formal News Report",
    prompt:
      "దయచేసి ఈ సమాచారం ఆధారంగా ఓ సంపూర్ణమైన వార్తా కథనాన్ని తెలుగులో 50 పదాలలో వ్రాయండి. అధికారిక మరియు నిష్పక్షపాత శైలి పాటించండి.\n\nవిషయం: [ఉదాహరణ: ఆంధ్రప్రదేశ్ లో భారీ వర్షాలు]\n\nవివరణ:\n- వర్షాల కారణంగా నదులు పొంగిపొర్లాయి\n- ప్రజలు సురక్షిత ప్రాంతాలకు తరలింపు\n- ప్రభుత్వ సహాయక చర్యలు కొనసాగుతున్నాయి\n- విద్యుత్ సరఫరాలో అంతరాయం\n\nవార్త శీర్షికతో ప్రారంభించి, కీలక అంశాలతో కథనం కొనసాగించండి.",
  },
  {
    title: "బ్రేకింగ్ న్యూస్",
    style: "Breaking News",
    prompt:
      "ఈ విషయాన్ని బ్రేకింగ్ న్యూస్ శైలిలో, సంక్షిప్తంగా తెలుగులో 50 పదాలలో రాయండి. ప్రధానంగా కీలకాంశాలు, ప్రజల ప్రాథమిక సమాచారం మరియు అధికారుల ప్రకటనలు చేర్చండి.\n\nవిషయం: [ఉదాహరణ: హైదరాబాద్ లో భూకంపం లాఘవం]\n\nసంక్షిప్త కథనం, ఉదాహరణగా TV స్క్రోల్ కి అనువుగా ఉండాలి.",
  },
  {
    title: "వ్యాసం / అభిప్రాయ రచన",
    style: "Editorial or Opinion",
    prompt:
      "దయచేసి క్రింది అంశం మీద 50 పదాలలో అభిప్రాయ వ్యాసం వ్రాయండి. ఇందులో విశ్లేషణాత్మక దృష్టికోణం, వాదనలు, మరియు రచయిత అభిప్రాయం చేర్చండి.\n\nఅంశం: [ఉదాహరణ: విద్యా రంగంలో ప్రైవేటీకరణ ప్రభావం]\n\nపురాణాలనో, నిధుల కొరతనో ఉదాహరణలతో చెప్తూ రాయండి.",
  },
  {
    title: "వినోద వార్తలు",
    style: "Entertainment News",
    prompt:
      "ఈ సినిమా గురించి వినోదాత్మక, ఉత్సాహభరితమైన శైలిలో తెలుగు వార్త కథనాన్ని 50 పదాలలో రాయండి.\n\nసినిమా పేరు: [ఉదాహరణ: RRR 2 - మొదటి లుక్ విడుదల]\nముఖ్య సమాచారం:\n- విడుదలైన పోస్టర్\n- నటీనటుల లుక్స్\n- డైరెక్టర్ వ్యాఖ్యలు\n- అభిమానుల స్పందన\n\nఈ అంశాలతో ఉత్తమమైన సినిమా వార్త రాయండి.",
  },
  {
    title: "ఆర్థిక వార్తలు",
    style: "Business / Finance News",
    prompt:
      "దయచేసి ఈ విషయంపై ఆర్థిక నిపుణుల శైలిలో తెలుగులో 50 పదాలలో వార్తా కథనం వ్రాయండి. డేటా, గణాంకాలు, మరియు ప్రభావాన్ని వివరించండి.\n\nవిషయం: [ఉదాహరణ: రూపాయి విలువ డాలరుతో పోల్చితే తగ్గింది]\n\nవాణిజ్య విశ్లేషణగా వ్రాయండి.",
  },
  {
    title: "శీర్షికలు మాత్రమే",
    style: "Headlines Only",
    prompt:
      "ఈ విషయానికి సంబంధించిన 5 తాజా వార్తా శీర్షికలు తెలుగులో 50 పదాలలో తయారు చేయండి. ప్రతీదీ ఆకర్షణీయంగా, క్లిక్‌బైట్ కాకుండా ఉండాలి.\n\nవిషయం: [ఉదాహరణ: భారతదేశంలో మానవ హక్కుల చర్చ]",
  },
  {
    title: "సంక్షిప్త సారాంశం",
    style: "Summarization",
    prompt:
      "దయచేసి ఈ సమాచారం ఆధారంగా సంక్షిప్తంగా 50 పదాలలో తెలుగులో సారాంశాన్ని తయారు చేయండి. ముఖ్యాంశాలను మాత్రమే చేర్చండి. శైలి స్పష్టంగా మరియు సరళంగా ఉండాలి.\n\nవిషయం: [ఉదాహరణ: కేంద్ర బడ్జెట్ 2025 వివరాలు]\n\nఉద్దేశ్యం: సమగ్ర విషయాన్ని తక్కువ పదాల్లో తెలియజేయడం.",
  },
];

// --- Helper Components ---
const Spinner = () => (
  <div className="flex justify-center items-center my-4">
    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
  </div>
);

const ErrorDisplay = ({ message }) => (
  <div
    className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4"
    role="alert"
  >
    <p className="font-bold">ఎర్రర్</p>
    <p>{message}</p>
  </div>
);

// --- Edit Modal Component ---
// ఈ కాంపోనెంట్ ఇప్పుడు ఒక కొత్త ఆర్టికల్‌ని సేవ్ చేయడానికి ముందు లేదా ఇప్పటికే ఉన్న ఆర్టికల్‌ను సవరించడానికి ఉపయోగపడుతుంది.
const ArticleModal = ({ article, onSave, onCancel, isLoading, title }) => {
  const [editedArticle, setEditedArticle] = useState(article);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedArticle((prev) => ({ ...prev, [name]: value }));
  };

  const handleMediaChange = (index, field, value) => {
    const newMedia = [...editedArticle.media];
    newMedia[index] = { ...newMedia[index], [field]: value };
    setEditedArticle((prev) => ({ ...prev, media: newMedia }));
  };

  const addMediaField = () => {
    setEditedArticle((prev) => ({
      ...prev,
      media: [...(prev.media || []), { type: "image", url: "" }],
    }));
  };

  const removeMediaField = (index) => {
    const newMedia = editedArticle.media.filter((_, i) => i !== index);
    setEditedArticle((prev) => ({ ...prev, media: newMedia }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="space-y-4">
          <input
            type="text"
            name="title"
            value={editedArticle.title}
            onChange={handleChange}
            placeholder="శీర్షిక"
            className="w-full px-4 py-2 border rounded-md"
          />
          <textarea
            name="body"
            value={editedArticle.body}
            onChange={handleChange}
            rows="8"
            placeholder="వార్తా కథనం"
            className="w-full px-4 py-2 border rounded-md"
          />

          <div>
            <h3 className="text-lg font-semibold mb-2">
              మీడియా (చిత్రాలు లేదా వీడియోలు)
            </h3>
            {editedArticle.media &&
              editedArticle.media.map((item, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <select
                    value={item.type}
                    onChange={(e) =>
                      handleMediaChange(index, "type", e.target.value)
                    }
                    className="px-2 py-2 border rounded-md"
                  >
                    <option value="image">చిత్రం</option>
                    <option value="youtube">యూట్యూబ్ వీడియో</option>
                  </select>
                  <input
                    type="text"
                    value={item.url}
                    onChange={(e) =>
                      handleMediaChange(index, "url", e.target.value)
                    }
                    placeholder={
                      item.type === "image"
                        ? "చిత్ర URL"
                        : "యూట్యూబ్ వీడియో URL"
                    }
                    className="w-full px-4 py-2 border rounded-md"
                  />
                  <button
                    onClick={() => removeMediaField(index)}
                    className="text-red-500 font-bold"
                  >
                    X
                  </button>
                </div>
              ))}
            <button
              onClick={addMediaField}
              className="text-indigo-600 font-semibold mt-2"
            >
              + మీడియాను జోడించండి
            </button>
          </div>
        </div>

        <div className="flex justify-end mt-6">
          <button
            onClick={onCancel}
            className="mr-4 text-gray-600 font-semibold"
          >
            రద్దు చేయండి
          </button>
          <button
            onClick={() => onSave(editedArticle)}
            className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
            disabled={isLoading}
          >
            {isLoading ? "సేవ్ అవుతోంది..." : "సేవ్ చేయండి"}
          </button>
        </div>
      </div>
    </div>
  );
};

// --- Main App Component ---
export default function NewsApp() {
  // --- State Management ---
  const [prompt, setPrompt] = useState("");
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);
  const [generatedArticle, setGeneratedArticle] = useState(null); // కొత్తగా సృష్టించబడిన ఆర్టికల్ కోసం స్టేట్

  // --- Data Fetching ---
  const fetchArticles = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch(
        "http://localhost:8000/api/articles?limit=20"
      );
      if (!response.ok) {
        throw new Error(`ఆర్టికల్స్‌ను పొందడం విఫలమైంది: ${response.status}`);
      }
      const data = await response.json();
      setArticles(data.articles);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchArticles();
  }, [fetchArticles]);

  // --- Event Handlers ---
  const handleTemplateChange = (e) => {
    const selectedIndex = e.target.value;
    if (selectedIndex !== "") {
      setPrompt(promptTemplates[selectedIndex].prompt);
    } else {
      setPrompt("");
    }
  };

  const handleGenerateSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("ఆర్టికల్‌ను సృష్టించడానికి దయచేసి ఒక ప్రాంప్ట్‌ను నమోదు చేయండి.");
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `సర్వర్ ఎర్రర్: ${response.status}`);
      }
      const newArticle = await response.json();
      setGeneratedArticle(newArticle); // సృష్టించిన ఆర్టికల్‌ను ప్రివ్యూ కోసం స్టేట్‌లో ఉంచండి
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveGeneratedArticle = async (article) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8000/api/articles", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(article),
      });
      if (!response.ok) {
        throw new Error("ఆర్టికల్‌ను సేవ్ చేయడం విఫలమైంది");
      }
      setGeneratedArticle(null); // సేవ్ చేసిన తర్వాత ప్రివ్యూను తొలగించండి
      setPrompt("");
      fetchArticles(); // తాజా ఆర్టికల్స్ పొందండి
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEditClick = (article) => {
    setCurrentArticle(article);
    setIsEditing(true);
  };

  const handleUpdateArticle = async (updatedArticle) => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/articles/${updatedArticle._id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedArticle),
        }
      );
      if (!response.ok) {
        throw new Error("ఆర్టికల్‌ను అప్‌డేట్ చేయడం విఫలమైంది");
      }
      setIsEditing(false);
      setCurrentArticle(null);
      fetchArticles();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteArticle = async (articleId) => {
    if (window.confirm("మీరు ఈ ఆర్టికల్‌ను నిజంగా తొలగించాలనుకుంటున్నారా?")) {
      setIsLoading(true);
      try {
        const response = await fetch(
          `http://localhost:8000/api/articles/${articleId}`,
          {
            method: "DELETE",
          }
        );
        if (!response.ok) {
          throw new Error("ఆర్టికల్‌ను తొలగించడం విఫలమైంది");
        }
        fetchArticles();
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    }
  };

  // --- JSX Rendering ---
  return (
    <div className="min-h-screen bg-gray-100 font-sans p-4 sm:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-800">
            AI న్యూస్ డాష్‌బోర్డ్
          </h1>
          <p className="mt-2 text-gray-600">
            వార్తా కథనాలను సృష్టించండి, సేవ్ చేయండి మరియు వీక్షించండి.
          </p>
        </header>

        {/* Existing Edit Modal for saved articles */}
        {isEditing && currentArticle && (
          <ArticleModal
            title="ఆర్టికల్‌ను సవరించండి"
            article={currentArticle}
            onSave={handleUpdateArticle}
            onCancel={() => setIsEditing(false)}
            isLoading={isLoading}
          />
        )}

        {/* New Preview & Save section for generated articles */}
        {generatedArticle && (
          <ArticleModal
            title="కొత్త ఆర్టికల్‌ను ప్రివ్యూ చేసి సేవ్ చేయండి"
            article={generatedArticle}
            onSave={handleSaveGeneratedArticle}
            onCancel={() => setGeneratedArticle(null)}
            isLoading={isLoading}
          />
        )}

        <section className="bg-white p-6 rounded-xl shadow-lg mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            కొత్త ఆర్టికల్‌ను సృష్టించండి
          </h2>
          <form onSubmit={handleGenerateSubmit}>
            <label
              htmlFor="prompt-template"
              className="block text-md font-medium text-gray-700 mb-2"
            >
              ప్రాంప్ట్ టెంప్లేట్‌ను ఎంచుకోండి
            </label>
            <select
              id="prompt-template"
              onChange={handleTemplateChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
              defaultValue=""
            >
              <option value="" disabled>
                ఒక శైలిని ఎంచుకోండి...
              </option>
              {promptTemplates.map((template, index) => (
                <option key={index} value={index}>
                  {template.title} ({template.style})
                </option>
              ))}
            </select>
            <label
              htmlFor="prompt-input"
              className="block text-md font-medium text-gray-700 mb-2"
            >
              మీ ప్రాంప్ట్‌ను మార్చండి
            </label>
            <textarea
              id="prompt-input"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="పైన ఉన్న టెంప్లేట్‌ను ఎంచుకోండి లేదా మీ సొంత ప్రాంప్ట్‌ను ఇక్కడ రాయండి..."
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="10"
              disabled={isLoading}
            />
            <div className="text-right mt-4">
              <button
                type="submit"
                className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
                disabled={isLoading}
              >
                {isLoading ? "సృష్టిస్తోంది..." : "సృష్టించండి"}
              </button>
            </div>
          </form>
        </section>

        <section>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              తాజా ఆర్టికల్స్
            </h2>
            <button
              onClick={fetchArticles}
              className="text-indigo-600 font-semibold hover:text-indigo-800 disabled:text-gray-400"
              disabled={isLoading}
            >
              రీఫ్రెష్
            </button>
          </div>
          {isLoading && <Spinner />}
          {error && <ErrorDisplay message={error} />}
          {!isLoading && !error && (
            <div className="space-y-4">
              {articles.length > 0 ? (
                articles.map((article) => (
                  <div
                    key={article._id}
                    className="bg-white p-6 rounded-xl shadow-md"
                  >
                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {article.title}
                    </h3>
                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                      {article.body}
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {article.media &&
                        article.media.map((item, index) => {
                          if (item.type === "youtube") {
                            const videoId =
                              item.url.split("v=")[1]?.split("&")[0] ||
                              item.url.split("/").pop();
                            return (
                              <div
                                key={index}
                                className="aspect-w-16 aspect-h-9"
                              >
                                <iframe
                                  src={`https://www.youtube.com/embed/${videoId}`}
                                  frameBorder="0"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                  title={`YouTube video ${index + 1}`}
                                  className="w-full h-full rounded-md"
                                ></iframe>
                              </div>
                            );
                          }
                          return (
                            <img
                              key={index}
                              src={item.url}
                              alt={`వార్తకు సంబంధించిన చిత్రం ${index + 1}`}
                              className="w-full h-auto rounded-md"
                            />
                          );
                        })}
                    </div>

                    <div className="flex justify-between items-center mt-4">
                      <p className="text-sm text-gray-500">
                        ప్రచురించబడింది:{" "}
                        {new Date(article.publishedAt).toLocaleString()}
                      </p>
                      <div className="flex space-x-4">
                        <button
                          onClick={() => handleEditClick(article)}
                          className="text-blue-500 hover:underline"
                        >
                          సవరించండి
                        </button>
                        <button
                          onClick={() => handleDeleteArticle(article._id)}
                          className="text-red-500 hover:underline"
                        >
                          తొలగించండి
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500">
                  ఏ ఆర్టికల్స్ లభించలేదు. ఒకటి సృష్టించి చూడండి!
                </p>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
