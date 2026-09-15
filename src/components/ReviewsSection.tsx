import React, { useState } from "react";
import { CLINIC_INFO, REVIEWS_LIST } from "../data/clinicData";
import { ReviewItem } from "../types";
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  ThumbsUp, 
  Plus, 
  ExternalLink,
  Filter,
  Quote
} from "lucide-react";

export const ReviewsSection: React.FC = () => {
  const [reviews, setReviews] = useState<ReviewItem[]>(REVIEWS_LIST);
  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [isWriteModalOpen, setIsWriteModalOpen] = useState(false);

  // New review form state
  const [newAuthor, setNewAuthor] = useState("");
  const [newRating, setNewRating] = useState(5);
  const [newTag, setNewTag] = useState("L5 Spine & Orthopedic");
  const [newComment, setNewComment] = useState("");
  const [formSubmitted, setFormSubmitted] = useState(false);

  const filterOptions = [
    { id: "all", label: "All 296 Reviews" },
    { id: "L5 Spine", label: "L5 Spine Treatment" },
    { id: "Geriatric", label: "Elderly & Grandmother Care" },
    { id: "Orthopedic", label: "Orthopedic Problems" },
  ];

  const filteredReviews = activeFilter === "all"
    ? reviews
    : reviews.filter((r) => r.treatmentTag.toLowerCase().includes(activeFilter.toLowerCase()));

  const handleAddReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAuthor || !newComment) return;

    const createdReview: ReviewItem = {
      id: `rev-user-${Date.now()}`,
      author: newAuthor,
      rating: newRating,
      timeAgo: "Just now",
      comment: newComment,
      treatmentTag: newTag,
      verified: true,
    };

    setReviews([createdReview, ...reviews]);
    setFormSubmitted(true);
    setTimeout(() => {
      setIsWriteModalOpen(false);
      setFormSubmitted(false);
      setNewAuthor("");
      setNewComment("");
    }, 1500);
  };

  return (
    <section id="reviews" className="py-16 md:py-24 bg-slate-950 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Google Reviews Summary Header */}
        <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-3xl p-6 sm:p-10 mb-12 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Google Rating Big Metric */}
            <div className="lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Google Verified Rating
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
              </div>
              <div className="flex items-baseline gap-3">
                <span className="font-['Outfit'] text-5xl sm:text-6xl font-extrabold text-white">
                  {CLINIC_INFO.rating}
                </span>
                <div className="flex flex-col items-start">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs text-slate-400 mt-1 font-medium">
                    Based on <strong>{CLINIC_INFO.reviewCount} Google reviews</strong>
                  </span>
                </div>
              </div>
              <p className="text-xs text-slate-400">
                Physiotherapist in Bengaluru, Karnataka · Verified Business
              </p>
            </div>

            {/* Middle Quote Highlight: Sirisha & Arpitha */}
            <div className="lg:col-span-5 border-y lg:border-y-0 lg:border-x border-slate-800 py-6 lg:py-0 lg:px-8 space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-teal-400">
                <Quote className="w-4 h-4" />
                <span>Featured Patient Feedback:</span>
              </div>
              <p className="text-sm text-slate-300 italic">
                &ldquo;I received treatment for my L5 spine, and Dr. Nikitha did an excellent job.&rdquo;
              </p>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>— sirisha T (Google Verified Patient)</span>
                <span className="text-amber-400 font-bold">5.0 ★</span>
              </div>
            </div>

            {/* Right Action buttons */}
            <div className="lg:col-span-3 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
              <button
                onClick={() => setIsWriteModalOpen(true)}
                className="w-full py-3 px-4 rounded-xl bg-teal-500 hover:bg-teal-400 text-slate-950 font-bold text-sm shadow-lg shadow-teal-500/20 transition flex items-center justify-center gap-2 active:scale-95"
              >
                <Plus className="w-4 h-4" />
                <span>Write a Google Review</span>
              </button>
              <a
                href={CLINIC_INFO.googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-medium text-sm border border-slate-700 transition flex items-center justify-center gap-2"
              >
                <ExternalLink className="w-4 h-4 text-cyan-400" />
                <span>View on Google Maps</span>
              </a>
            </div>
          </div>
        </div>

        {/* Category Filters for Reviews */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-teal-400" />
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Filter Patient Cases:
            </span>
          </div>
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((opt) => (
              <button
                key={opt.id}
                onClick={() => setActiveFilter(opt.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-medium transition ${
                  activeFilter === opt.id
                    ? "bg-teal-500 text-slate-950 font-semibold"
                    : "bg-slate-900 text-slate-400 hover:text-white border border-slate-800"
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Masonry/Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-slate-900/80 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition space-y-4"
            >
              <div className="space-y-3">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-teal-500 to-cyan-500 flex items-center justify-center text-slate-950 font-bold text-sm">
                      {rev.author.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h4 className="font-semibold text-white text-sm flex items-center gap-1.5">
                        {rev.author}
                      </h4>
                      <div className="flex items-center gap-1 text-[11px] text-slate-400">
                        <span>{rev.timeAgo}</span>
                        <span>·</span>
                        <span className="text-teal-400 flex items-center gap-0.5">
                          <CheckCircle2 className="w-3 h-3" /> Verified
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Stars */}
                  <div className="flex text-amber-400">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                </div>

                {/* Tag */}
                <div className="inline-block">
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-teal-950/80 text-teal-300 font-medium border border-teal-800/50">
                    {rev.treatmentTag}
                  </span>
                </div>

                {/* Comment */}
                <p className="text-slate-300 text-xs sm:text-sm leading-relaxed">
                  &ldquo;{rev.comment}&rdquo;
                </p>
              </div>

              {/* Bottom attribution */}
              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] text-slate-500">
                <span>Google Review</span>
                <span className="text-slate-400">Dr Nice Physiotherapy Centre</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Write a Review Modal */}
      {isWriteModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 max-w-md w-full shadow-2xl relative">
            <h3 className="font-['Outfit'] text-xl font-bold text-white mb-1">
              Write a Google Review
            </h3>
            <p className="text-xs text-slate-400 mb-4">
              Share your rehabilitation experience with Dr. Nikitha and the team.
            </p>

            {formSubmitted ? (
              <div className="py-8 text-center space-y-2">
                <div className="w-12 h-12 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="font-semibold text-white text-base">Thank you for your feedback!</h4>
                <p className="text-xs text-slate-400">
                  Your review has been registered for Dr Nice Physiotherapy Centre.
                </p>
              </div>
            ) : (
              <form onSubmit={handleAddReview} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Name:</label>
                  <input
                    type="text"
                    required
                    value={newAuthor}
                    onChange={(e) => setNewAuthor(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. Ramesh Kumar"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Star Rating:</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onClick={() => setNewRating(star)}
                        className="p-1 text-slate-500 hover:text-amber-400 transition"
                      >
                        <Star
                          className={`w-6 h-6 ${
                            star <= newRating
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-600"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Treatment Condition:</label>
                  <input
                    type="text"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                    placeholder="e.g. L5 Spine, Knee Rehabilitation, Neck Pain"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-medium mb-1">Your Review:</label>
                  <textarea
                    required
                    rows={3}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white focus:outline-none focus:border-teal-400"
                    placeholder="Share how Dr. Nikitha and the therapy helped you..."
                  />
                </div>

                <div className="flex items-center justify-end gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => setIsWriteModalOpen(false)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-medium hover:bg-slate-700"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-teal-500 text-slate-950 text-xs font-bold hover:bg-teal-400 shadow-md transition"
                  >
                    Post Review
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
