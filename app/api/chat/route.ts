import { NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Product database
const products = {
  women: [
    {
      id: 1,
      name: "Pink Embroidered Anarkali Dress",
      price: 89,
      image: "/images/women/women1.jpeg",
      description: "Beautiful pink anarkali with gold embroidery",
      tags: ["women", "ethnic", "dress", "festive"],
    },
    {
      id: 2,
      name: "Pink Chanderi Suit Set",
      price: 75,
      image: "/images/women/women2.jpeg",
      description: "Elegant pink suit with golden border details",
      tags: ["women", "ethnic", "suit", "pink"],
    },
    {
      id: 3,
      name: "Purple Banarasi Anarkali",
      price: 110,
      image: "/images/women/women3.jpeg",
      description: "Stunning purple anarkali with rich border",
      tags: ["women", "ethnic", "anarkali", "purple"],
    },
    {
      id: 4,
      name: "Floral Printed Maxi Dress",
      price: 65,
      image: "/images/women/women4.jpeg",
      description: "Comfortable floral maxi dress for casual wear",
      tags: ["women", "casual", "dress", "floral"],
    },
    {
      id: 5,
      name: "Maroon Banarasi Silk Set",
      price: 120,
      image: "/images/women/women5.jpeg",
      description: "Luxurious maroon silk set with golden details",
      tags: ["women", "ethnic", "silk", "maroon"],
    },
  ],
  laptops: [
    {
      id: 6,
      name: 'MacBook Pro 13"',
      price: 1299,
      image: "/images/laptops/laptop1.jpeg",
      description: "Powerful laptop with Retina display and all-day battery life",
      tags: ["laptops", "apple", "macbook", "pro"],
    },
    {
      id: 7,
      name: "Windows Ultrabook",
      price: 899,
      image: "/images/laptops/laptop2.jpeg",
      description: "Sleek Windows laptop with vibrant display and fast performance",
      tags: ["laptops", "windows", "ultrabook", "thin"],
    },
    {
      id: 8,
      name: "Dell XPS 13",
      price: 1199,
      image: "/images/laptops/laptop3.jpeg",
      description: "Premium ultrabook with edge-to-edge display and aluminum chassis",
      tags: ["laptops", "dell", "xps", "premium"],
    },
    {
      id: 9,
      name: "MacBook Air",
      price: 999,
      image: "/images/laptops/laptop4.jpeg",
      description: "Ultra-thin and light laptop perfect for everyday use",
      tags: ["laptops", "apple", "macbook", "air"],
    },
    {
      id: 10,
      name: "Professional Workstation",
      price: 1499,
      image: "/images/laptops/laptop5.jpeg",
      description: "High-performance laptop for creative professionals",
      tags: ["laptops", "workstation", "professional", "high-performance"],
    },
  ],
  kids: [
    {
      id: 11,
      name: "Kids Festival Collection",
      price: 45,
      image: "/images/kids/kids1.jpeg",
      description: "Festive wear for kids in various colors",
      tags: ["kids", "ethnic", "festive"],
    },
    {
      id: 12,
      name: "Girls Summer Dresses",
      price: 35,
      image: "/images/kids/kids2.jpeg",
      description: "Set of colorful summer dresses for girls",
      tags: ["kids", "girls", "casual", "summer"],
    },
    {
      id: 13,
      name: "Green & Pink Lehenga Set",
      price: 55,
      image: "/images/kids/kids3.jpeg",
      description: "Traditional lehenga set for girls",
      tags: ["kids", "girls", "ethnic", "lehenga"],
    },
    {
      id: 14,
      name: "Pink Floral Kurti",
      price: 40,
      image: "/images/kids/kids4.jpeg",
      description: "Comfortable pink kurti with floral pattern",
      tags: ["kids", "girls", "ethnic", "kurti"],
    },
    {
      id: 15,
      name: "Pink Salwar Suit Set",
      price: 48,
      image: "/images/kids/kids5.jpeg",
      description: "Elegant pink salwar suit for girls",
      tags: ["kids", "girls", "ethnic", "suit"],
    },
  ],
  skincare: [
    {
      id: 16,
      name: "Hydrating Serum",
      price: 45,
      image: "/images/serum.jpeg",
      description: "Intense moisture for all skin types",
      tags: ["hydration", "all skin types", "serum"],
    },
    {
      id: 17,
      name: "Vitamin C Moisturizer",
      price: 38,
      image: "/images/moisturizer.jpeg",
      description: "Brightens and firms skin",
      tags: ["brightening", "anti-aging", "moisturizer"],
    },
    {
      id: 18,
      name: "Olay Total Effects Cleanser",
      price: 32,
      image: "/images/cleanser.webp",
      description: "7-in-1 nourishing formula",
      tags: ["cleanser", "anti-aging", "combination skin"],
    },
    {
      id: 19,
      name: "Cetaphil Daily Facial Cleanser",
      price: 28,
      image: "/images/skincare-set.jpeg",
      description: "Gentle formula for sensitive skin",
      tags: ["cleanser", "sensitive skin", "daily use"],
    },
    {
      id: 20,
      name: "Neutrogena Skin Balancing Cleanser",
      price: 24,
      image: "/images/skincare-blue.webp",
      description: "With polyhydroxy acid for balanced skin",
      tags: ["cleanser", "oily skin", "acne-prone"],
    },
  ],
}

// Fallback responses for when the API key is missing
const fallbackResponses = [
  // Greeting responses
  "Hi there! How can I help you today? I can recommend products, help you build your shopping cart, or answer questions about our subscription service.",
  "Hello! I'm your AI shopping assistant. How can I assist you today? Would you like to explore our clothing collections, laptops, or beauty products?",
  "Hey! I'm here to help you find the perfect products. What are you looking for today?",

  // How are you responses
  "I'm doing great, thanks for asking! How can I help you today? Would you like to explore our women's clothing, laptops, kids' clothing, or skincare products?",
  "I'm fine, thank you for asking! How can I assist you today? Are you looking for something specific?",
  "I'm doing well! Thanks for asking. What can I help you with today? Would you like to see our latest products?",

  // Women's clothing responses
  "Here are some popular women's clothing items from our collection. You can add these to your cart or view alternatives. Would you like to see more options?",
  "I've selected these women's clothing items based on our latest trends. Would you like to add any of these to your cart?",
  "These are some of our most popular women's clothing items. Would you like me to recommend something specific for you?",

  // Laptop responses
  "Here are some popular laptops from our collection. You can add these to your cart or view alternatives. Would you like me to help you choose the right one for your needs?",
  "I've selected these laptops based on performance and value. Would you like to add any of these to your cart?",
  "These are some of our best-selling laptops. Would you like more information about any of these models?",

  // Kids' clothing responses
  "Here are some lovely clothing items for kids from our collection. You can add these to your cart or view alternatives. Would you like to see more options?",
  "I've selected these kids' clothing items based on comfort and style. Would you like to add any of these to your cart?",
  "These are some of our most popular kids' clothing items. Would you like me to recommend something specific for your child?",

  // Skincare responses
  "Here are some popular skincare products from our collection. You can add these to your cart or view alternatives. Would you like me to help you build a skincare routine?",
  "I've selected these skincare products based on effectiveness and quality. Would you like to add any of these to your cart?",
  "These are some of our best-selling skincare products. Would you like more information about any of these items?",

  // Subscription management responses
  "You can manage your subscription by visiting the 'Manage Subscription' page. There, you can skip a delivery, update your products, pause or cancel your subscription. Would you like me to take you there now?",
  "I can help you manage your subscription! You can skip a box, change products, pause or cancel your subscription. What would you like to do?",

  // Order history responses
  "You can view your order history by visiting the 'Order History' page. Would you like me to take you there now?",
  "I can show you your order history. You'll be able to see all your past orders and their status. Would you like to see that now?",

  // Checkout responses
  "Great! You're ready to checkout with your selected items. You can complete your purchase by clicking the 'Proceed to Checkout' button in your cart, or I can take you there now. Would you like to proceed to checkout?",
  "Your cart looks good! Would you like to proceed to checkout now?",
]

// Function to handle cart-related commands
const handleCartCommand = (message: string) => {
  const lowerMessage = message.toLowerCase()

  // Check if the message is about adding products to cart
  if (
    lowerMessage.includes("add") &&
    (lowerMessage.includes("cart") || lowerMessage.includes("box") || lowerMessage.includes("basket"))
  ) {
    // Extract product names from the message
    const productMatches = []

    // Check for products across all categories
    for (const category of Object.keys(products)) {
      for (const product of products[category]) {
        if (lowerMessage.includes(product.name.toLowerCase())) {
          productMatches.push(product)
          continue
        }

        // Check for partial matches
        const nameParts = product.name.toLowerCase().split(" ")
        for (const part of nameParts) {
          if (part.length > 3 && lowerMessage.includes(part)) {
            productMatches.push(product)
            break
          }
        }
      }
    }

    if (productMatches.length > 0) {
      return {
        response: `I've found ${productMatches.length} product(s) that match your request. I've added ${productMatches.map((p) => p.name).join(", ")} to your cart. Is there anything else you'd like to add?`,
        recommendedProducts: productMatches,
        addToCart: true,
      }
    } else {
      // Try to determine which category they might be interested in
      let category = null
      if (lowerMessage.includes("women") || lowerMessage.includes("dress") || lowerMessage.includes("suit")) {
        category = "women"
      } else if (
        lowerMessage.includes("laptop") ||
        lowerMessage.includes("computer") ||
        lowerMessage.includes("macbook")
      ) {
        category = "laptops"
      } else if (lowerMessage.includes("kid") || lowerMessage.includes("children") || lowerMessage.includes("girl")) {
        category = "kids"
      } else if (
        lowerMessage.includes("skin") ||
        lowerMessage.includes("serum") ||
        lowerMessage.includes("moisturizer")
      ) {
        category = "skincare"
      }

      if (category) {
        const suggestedProducts = products[category].slice(0, 3)
        return {
          response: `I couldn't find the specific product you mentioned, but here are some popular ${category} items you might like. Would you like me to add any of these to your cart?`,
          recommendedProducts: suggestedProducts,
        }
      } else {
        return {
          response:
            "I couldn't find the specific product you mentioned. Could you tell me more about what type of product you're looking for? For example, are you interested in women's clothing, laptops, kids' clothing, or skincare?",
          recommendedProducts: [],
        }
      }
    }
  }

  // Check if the message is about showing products
  if (
    (lowerMessage.includes("show") || lowerMessage.includes("see") || lowerMessage.includes("view")) &&
    (lowerMessage.includes("product") || lowerMessage.includes("item") || lowerMessage.includes("option"))
  ) {
    let category = null
    if (lowerMessage.includes("women") || lowerMessage.includes("dress") || lowerMessage.includes("suit")) {
      category = "women"
    } else if (
      lowerMessage.includes("laptop") ||
      lowerMessage.includes("computer") ||
      lowerMessage.includes("macbook")
    ) {
      category = "laptops"
    } else if (lowerMessage.includes("kid") || lowerMessage.includes("children") || lowerMessage.includes("girl")) {
      category = "kids"
    } else if (
      lowerMessage.includes("skin") ||
      lowerMessage.includes("serum") ||
      lowerMessage.includes("moisturizer")
    ) {
      category = "skincare"
    } else {
      // Default to women's clothing if no category specified
      category = "women"
    }

    return {
      response: `Here are some popular ${category} items from our collection. Would you like to add any of these to your cart?`,
      recommendedProducts: products[category].slice(0, 3),
    }
  }

  // Check if the message is about removing from cart
  if (
    lowerMessage.includes("remove") &&
    (lowerMessage.includes("cart") || lowerMessage.includes("box") || lowerMessage.includes("basket"))
  ) {
    return {
      response:
        "I can help you remove items from your cart. Please let me know which specific product you'd like to remove.",
      action: "remove_from_cart",
    }
  }

  // Check if the message is about checkout
  if (lowerMessage.includes("checkout") || lowerMessage.includes("buy") || lowerMessage.includes("purchase")) {
    return {
      response:
        "Great! I can help you proceed to checkout. Would you like to review your cart first or go directly to checkout?",
      action: "checkout",
    }
  }

  // Check if the message is about order history
  if (lowerMessage.includes("order") && lowerMessage.includes("history")) {
    return {
      response:
        "I can show you your order history. You'll be able to see all your past orders and their status. Would you like to see that now?",
      action: "view_order_history",
    }
  }

  // Check if the message is about subscription management
  if (lowerMessage.includes("subscription") && (lowerMessage.includes("manage") || lowerMessage.includes("change"))) {
    return {
      response:
        "I can help you manage your subscription! You can skip a box, change products, pause or cancel your subscription. What would you like to do?",
      action: "manage_subscription",
    }
  }

  return null
}

// Function to handle greeting messages
const handleGreeting = (message: string) => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("hi") || lowerMessage.includes("hello") || lowerMessage.includes("hey")) {
    return {
      response:
        "Hi there! How can I help you today? I can recommend products, help you build your shopping cart, or answer questions about our subscription service.",
    }
  }

  if (lowerMessage.includes("how are you")) {
    return {
      response:
        "I'm doing great, thanks for asking! How can I help you today? Would you like to explore our women's clothing, laptops, kids' clothing, or skincare products?",
    }
  }

  return null
}

// Function to handle category-specific requests
const handleCategoryRequest = (message: string) => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("women") || lowerMessage.includes("woman") || lowerMessage.includes("ladies")) {
    return {
      response:
        "Here are some popular women's clothing items from our collection. You can add these to your cart or view alternatives.",
      recommendedProducts: products.women.slice(0, 3),
      category: "women",
    }
  }

  if (lowerMessage.includes("laptop") || lowerMessage.includes("computer") || lowerMessage.includes("macbook")) {
    return {
      response:
        "Here are some popular laptops from our collection. You can add these to your cart or view alternatives.",
      recommendedProducts: products.laptops.slice(0, 3),
      category: "laptops",
    }
  }

  if (lowerMessage.includes("kid") || lowerMessage.includes("child") || lowerMessage.includes("children")) {
    return {
      response:
        "Here are some lovely clothing items for kids from our collection. You can add these to your cart or view alternatives.",
      recommendedProducts: products.kids.slice(0, 3),
      category: "kids",
    }
  }

  if (lowerMessage.includes("skin") || lowerMessage.includes("beauty") || lowerMessage.includes("skincare")) {
    return {
      response:
        "Here are some popular skincare products from our collection. You can add these to your cart or view alternatives.",
      recommendedProducts: products.skincare.slice(0, 3),
      category: "skincare",
    }
  }

  return null
}

export async function POST(req: Request) {
  try {
    const { message, userProfile } = await req.json()

    // Check if OpenAI API key is available and valid
    const apiKey = process.env.OPENAI_API_KEY
    let useOpenAI = false

    // Only use OpenAI if we have what looks like a valid API key
    // Valid OpenAI keys start with "sk-" and are longer than 20 characters
    if (apiKey && apiKey.startsWith("sk-") && apiKey.length > 20) {
      useOpenAI = true
    } else {
      console.log("OpenAI API key is missing or invalid. Using fallback response.")
    }

    let responseText = ""
    let recommendedProducts = []
    let addToCart = false
    const action = ""
    let category = ""

    // First check if it's a greeting
    const greetingResponse = handleGreeting(message)
    if (greetingResponse) {
      return NextResponse.json({
        response: greetingResponse.response,
        recommendedProducts: null,
        addToCart: false,
      })
    }

    // Then check if it's a category request
    const categoryResponse = handleCategoryRequest(message)
    if (categoryResponse) {
      return NextResponse.json({
        response: categoryResponse.response,
        recommendedProducts: categoryResponse.recommendedProducts,
        category: categoryResponse.category,
        addToCart: false,
      })
    }

    // Check if the message is a cart command
    const cartCommand = handleCartCommand(message)
    if (cartCommand) {
      return NextResponse.json({
        response: cartCommand.response,
        recommendedProducts: cartCommand.recommendedProducts,
        addToCart: cartCommand.addToCart || false,
        action: cartCommand.action || "",
      })
    }

    if (useOpenAI) {
      try {
        // If API key is available and valid, use the OpenAI API
        const systemPrompt = `
        You are a shopping assistant AI for a subscription box service called PersonalizedBox.
        Your goal is to recommend personalized products based on the user's preferences.
        
        Here's what you know about the user (if provided):
        ${userProfile ? JSON.stringify(userProfile) : "No profile information yet."}
        
        When responding to users:
        1. If they're new, ask about their preferences, age range, and style.
        2. Provide specific product recommendations with benefits.
        3. Explain why each product would work for their specific needs.
        4. Be conversational, friendly, and helpful.
        5. If they ask about subscription options, explain our plans: Monthly ($59.99), Quarterly ($169.99, save 10%), and Yearly ($599.99, save 20%).
        6. If they want to customize their box, help them understand how to add or remove products.
        7. If they ask about a specific concern, recommend appropriate products.
        8. If they want to add products to their cart, tell them you can help with that and suggest specific products.
        9. Keep your responses concise, friendly, and focused on helping the user find the right products.
        10. If they ask about women's clothing, laptops, kids' clothing, or skincare, recommend products from those categories.
        11. Always be ready to add products to their cart when they ask.
        
        Always end your response with a question to keep the conversation going.
      `

        const { text } = await generateText({
          model: openai("gpt-4o"),
          prompt: message,
          system: systemPrompt,
          temperature: 0.7,
          max_tokens: 800,
        })

        responseText = text
      } catch (error) {
        console.error("OpenAI API error:", error)
        // If there's an error with the OpenAI API, fall back to static responses
        const randomIndex = Math.floor(Math.random() * fallbackResponses.length)
        responseText = fallbackResponses[randomIndex]
      }
    } else {
      // If API key is missing or invalid, use a fallback response
      const randomIndex = Math.floor(Math.random() * fallbackResponses.length)
      responseText = fallbackResponses[randomIndex]
    }

    // Analyze the message to extract potential product recommendations
    // Simple keyword matching for demo purposes
    const lowerMessage = message.toLowerCase()

    // Check for category mentions
    if (lowerMessage.includes("women") || lowerMessage.includes("dress") || lowerMessage.includes("suit")) {
      recommendedProducts = [...products.women.slice(0, 3)]
      category = "women"
    } else if (
      lowerMessage.includes("laptop") ||
      lowerMessage.includes("computer") ||
      lowerMessage.includes("macbook")
    ) {
      recommendedProducts = [...products.laptops.slice(0, 3)]
      category = "laptops"
    } else if (lowerMessage.includes("kid") || lowerMessage.includes("children") || lowerMessage.includes("girl")) {
      recommendedProducts = [...products.kids.slice(0, 3)]
      category = "kids"
    } else if (
      lowerMessage.includes("skin") ||
      lowerMessage.includes("serum") ||
      lowerMessage.includes("moisturizer")
    ) {
      recommendedProducts = [...products.skincare.slice(0, 3)]
      category = "skincare"
    } else if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.includes("hey")) {
      // Provide a mix of popular products for greetings
      recommendedProducts = [products.women[0], products.laptops[0], products.kids[0]].filter(Boolean)
    } else {
      // If no specific category mentioned, provide a mix of products
      recommendedProducts = [products.women[0], products.laptops[0], products.kids[0], products.skincare[0]].filter(
        Boolean,
      )
    }

    // Check if the message is about adding to cart
    if (
      lowerMessage.includes("add") &&
      (lowerMessage.includes("cart") || lowerMessage.includes("box") || lowerMessage.includes("basket"))
    ) {
      addToCart = true
    }

    // Remove duplicates
    recommendedProducts = recommendedProducts
      .filter((product, index, self) => index === self.findIndex((p) => p.id === product.id))
      .slice(0, 4) // Limit to 4 products max

    return NextResponse.json({
      response: responseText,
      recommendedProducts: recommendedProducts.length > 0 ? recommendedProducts : null,
      category: category || null,
      addToCart: addToCart,
      action: action,
    })
  } catch (error) {
    console.error("Error in chat API:", error)
    return NextResponse.json(
      {
        response: "I'm having trouble connecting right now. Please try again later.",
        error: "Failed to process your request",
      },
      { status: 500 },
    )
  }
}

