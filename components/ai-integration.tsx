"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import Image from "next/image"

export default function AIIntegration() {
  const [activeTab, setActiveTab] = useState("overview")

  return (
    <div className="container mx-auto px-4 py-12">
      <motion.h2
        className="text-3xl font-bold text-center mb-8 bg-gradient-to-r from-pink-600 to-purple-600 text-transparent bg-clip-text"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        AI-Powered Personalization
      </motion.h2>

      <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="process">How It Works</TabsTrigger>
          <TabsTrigger value="features">Key Features</TabsTrigger>
          <TabsTrigger value="tech">Tech Stack</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <Card className="border-0 shadow-lg overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-purple-100 p-6">
              <h3 className="text-2xl font-bold">AI Integration in Personalized Box</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-lg mb-4">
                    AI plays a crucial role in making the Personalized Subscription Box Generator smart and efficient by
                    offering personalized product recommendations, intelligent interactions, and dynamic customization.
                  </p>
                  <p className="mb-4">
                    Our AI system understands your preferences through natural conversation, matches products
                    intelligently, provides dynamic customization options, and continuously improves based on your
                    feedback.
                  </p>
                  <div className="bg-pink-50 p-4 rounded-lg border border-pink-100 mt-6">
                    <h4 className="font-bold text-pink-700 mb-2">How AI Enhances Your Experience:</h4>
                    <ul className="list-disc pl-5 space-y-2">
                      <li>Understands your unique needs through conversational AI</li>
                      <li>Recommends products tailored to your preferences</li>
                      <li>Offers smart alternatives based on your profile</li>
                      <li>Learns from your feedback to improve future recommendations</li>
                    </ul>
                  </div>
                </div>
                <div className="relative h-[300px] md:h-full rounded-lg overflow-hidden">
                  <Image
                    src="/images/ai-recommendation-system.png"
                    alt="AI Recommendation System"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="process" className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-purple-100 to-blue-100 p-6">
              <h3 className="text-2xl font-bold">The AI Process</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-8">
                <motion.div
                  className="flex flex-col md:flex-row gap-6 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-purple-600">1</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">Understanding User Preferences</h4>
                    <p>
                      When you interact with our AI-powered chatbot, it collects details about your preferences,
                      specific concerns, and budget preferences using Natural Language Processing (NLP).
                    </p>
                    <div className="bg-gray-100 p-3 rounded-md mt-3 text-sm">
                      <strong>Example:</strong> "I have combination skin and need products for hydration and
                      anti-aging."
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col md:flex-row gap-6 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                >
                  <div className="bg-pink-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-pink-600">2</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">AI-Driven Product Recommendations</h4>
                    <p>
                      Our AI Recommendation Engine selects the best products from our database by matching your needs
                      with product attributes, considering your age group and skin type for better accuracy.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-3">
                      <div className="bg-white shadow p-3 rounded-md text-sm">
                        <p className="font-bold">Hydrating Hyaluronic Serum</p>
                        <p className="text-xs text-gray-600">Best for moisture retention</p>
                      </div>
                      <div className="bg-white shadow p-3 rounded-md text-sm">
                        <p className="font-bold">Vitamin C Moisturizer</p>
                        <p className="text-xs text-gray-600">Reduces fine lines and firms skin</p>
                      </div>
                      <div className="bg-white shadow p-3 rounded-md text-sm">
                        <p className="font-bold">Lightweight Sunscreen</p>
                        <p className="text-xs text-gray-600">Oil-free and prevents aging</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col md:flex-row gap-6 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-blue-600">3</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">Customization & Smart Suggestions</h4>
                    <p>
                      AI enhances your customization experience by offering alternative suggestions, personalized upsell
                      options, and smart replacements for unavailable items.
                    </p>
                    <div className="bg-gray-100 p-3 rounded-md mt-3 text-sm">
                      <strong>Example Interaction:</strong>
                      <br />
                      User: "I don't want the moisturizer. Can I replace it?"
                      <br />
                      AI: "You can swap it with a Niacinamide Concentrate or a Ceramide Night Cream."
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="flex flex-col md:flex-row gap-6 items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.3 }}
                >
                  <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center flex-shrink-0">
                    <span className="text-2xl font-bold text-green-600">4</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-xl font-bold mb-2">Continuous Learning & Improvement</h4>
                    <p>
                      Our AI constantly improves its recommendations by tracking your feedback, analyzing purchase
                      patterns, and enhancing future recommendations based on real user behavior.
                    </p>
                    <div className="bg-green-50 p-3 rounded-md mt-3 text-sm border border-green-100">
                      <p>
                        If most users with combination skin give high ratings to a specific serum, AI will prioritize
                        recommending that serum to similar users in the future.
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="features" className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-pink-100 to-blue-100 p-6">
              <h3 className="text-2xl font-bold">Key AI Features</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-pink-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-pink-600"
                    >
                      <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Natural Language Understanding</h4>
                  <p>
                    Our AI understands your natural language inputs, extracting key information about your preferences
                    and needs.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-purple-600"
                    >
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Smart Recommendation Engine</h4>
                  <p>
                    Advanced algorithms match your profile with our product database to suggest the most relevant items
                    for your needs.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-blue-600"
                    >
                      <path d="M20 7h-9"></path>
                      <path d="M14 17H5"></path>
                      <circle cx="17" cy="17" r="3"></circle>
                      <circle cx="7" cy="7" r="3"></circle>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Dynamic Customization</h4>
                  <p>
                    AI-powered suggestions adapt in real-time as you customize your box, offering alternatives and
                    complementary products.
                  </p>
                </motion.div>

                <motion.div
                  className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border border-gray-100"
                  whileHover={{ y: -5 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-green-600"
                    >
                      <path d="M12 2v4m0 12v4M4.93 4.93l2.83 2.83m8.48 8.48l2.83 2.83M2 12h4m12 0h4M4.93 19.07l2.83-2.83m8.48-8.48l2.83-2.83"></path>
                    </svg>
                  </div>
                  <h4 className="text-xl font-bold mb-2">Feedback Learning System</h4>
                  <p>
                    Our AI continuously improves by learning from user feedback, ratings, and purchase patterns to
                    enhance future recommendations.
                  </p>
                </motion.div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tech" className="mt-6">
          <Card className="border-0 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-blue-100 to-purple-100 p-6">
              <h3 className="text-2xl font-bold">AI Technology Stack</h3>
            </CardHeader>
            <CardContent className="p-6">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white rounded-lg overflow-hidden">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-3 px-4 text-left">Feature</th>
                      <th className="py-3 px-4 text-left">Technology</th>
                      <th className="py-3 px-4 text-left">Purpose</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">Natural Language Processing (NLP)</td>
                      <td className="py-3 px-4">NLTK, SpaCy, OpenAI GPT</td>
                      <td className="py-3 px-4">Understanding user queries and extracting preferences</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">Product Recommendation</td>
                      <td className="py-3 px-4">Scikit-Learn, TensorFlow, Collaborative Filtering</td>
                      <td className="py-3 px-4">Matching user preferences with suitable products</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">Chatbot AI</td>
                      <td className="py-3 px-4">OpenAI API, Rasa, Dialogflow</td>
                      <td className="py-3 px-4">Providing conversational interface for users</td>
                    </tr>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4 font-medium">Database for Preferences</td>
                      <td className="py-3 px-4">MongoDB</td>
                      <td className="py-3 px-4">Storing past purchases & interactions</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h4 className="font-bold text-blue-700 mb-2">API Integration:</h4>
                <p className="mb-3">
                  The API key functionality in the Personalized Subscription Box Generator plays a crucial role in
                  integrating AI services:
                </p>
                <ul className="list-disc pl-5 space-y-2">
                  <li>Secures access to NLP services like OpenAI GPT for the chatbot</li>
                  <li>Connects to external AI models for product recommendations</li>
                  <li>Enables authorized access to user preference databases</li>
                  <li>Facilitates feedback data transmission for model retraining</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

