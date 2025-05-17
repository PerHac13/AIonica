---

# 📘 Aionic Developer Mode — Model Configuration Documentation

> **Version**: 1.0
> **Last Updated**: May 17, 2025
> **Owner**: Shaikh Abdullah (Developer Mode)

---

## 🧠 Overview

The Aionic platform allows developers to dynamically register, configure, and serve AI models via JSON-based configurations. The models are rendered and proxied on the fly using MongoDB-driven schemas with modular design.

Each model is uniquely identified using a UUID (`modelId`).

---

## 📂 MongoDB Collection Breakdown

### 1. `models` — Master Registry

Defines basic metadata and discoverability.

```json
{
  "_id": "uuid-xxxx-xxxx",
  "slug": "mistral-7b",
  "displayName": "Mistral 7B",
  "tags": ["LLM", "text-gen"],
  "isPublished": true,
  "mode": "developer", // or "public"
  "createdAt": "2025-05-17T00:00:00Z"
}
```

---

### 2. `model_info` — Informational Metadata (Page Layout)

Optional fields that the frontend can override.

```json
{
  "modelId": "uuid-xxxx-xxxx",
  "heading": "Mistral 7B",
  "coverImage": "https://cdn.com/mistral.jpg",
  "author": {
    "name": "Open Source Team",
    "url": "https://example.com/author"
  },
  "description": "An open-weight model with powerful reasoning ability.",
  "template": "default-ui-v1",
  "docsMarkdown": "### How to use\nThis is how it works...",
  "source": "frontend" // "frontend" or "server"
}
```

---

### 3. `model_input_config` — Frontend Input & Output Config

Controls what fields to show in the input form, validation, and output display.

```json
{
  "modelId": "uuid-xxxx-xxxx",
  "input": [
    {
      "name": "prompt",
      "type": "textarea",
      "label": "Enter Prompt",
      "placeholder": "Type your prompt...",
      "required": true,
      "validation": {
        "minLength": 1,
        "maxLength": 500
      }
    },
    {
      "name": "temperature",
      "type": "slider",
      "label": "Temperature",
      "min": 0,
      "max": 1,
      "step": 0.1,
      "default": 0.7
    }
  ],
  "output": {
    "type": "text",
    "field": "response.result",
    "label": "Model Output"
  }
}
```

---

### 4. `model_api_config` — Backend Proxy & Field Mapping

Handles request proxying to external model APIs and maps the response.

```json
{
  "modelId": "uuid-xxxx-xxxx",
  "endpoint": "https://api.example.com/v1/generate",
  "method": "POST",
  "headers": {
    "Authorization": "Bearer {{api_key}}",
    "Content-Type": "application/json"
  },
  "requestMapping": {
    "body": {
      "prompt": "{{prompt}}",
      "temperature": "{{temperature}}"
    },
    "query": {},
    "params": {}
  },
  "outputMapping": {
    "type": "text",
    "field": "response.result",
    "transform": null
  }
}
```

---

### 5. `model_blogs` — Related Learning Resources

Connect related blogs and educational content to the model.

```json
{
  "modelId": "uuid-xxxx-xxxx",
  "blogs": [
    {
      "title": "Understanding Mistral",
      "url": "https://blogsite.com/mistral"
    },
    {
      "title": "Prompt Engineering Tips",
      "url": "https://blogsite.com/prompt-tips"
    }
  ]
}
```

---

### 6. `model_stats` — Analytics & Tracking

Tracks model usage for ranking and performance metrics.

```json
{
  "modelId": "uuid-xxxx-xxxx",
  "totalRequests": 12003,
  "successfulResponses": 11987,
  "failures": 16,
  "lastUsed": "2025-05-17T13:45:00Z",
  "weeklyStats": [
    {
      "weekStart": "2025-05-13",
      "requests": 4200
    }
  ]
}
```

---

## 🔗 Data Flow Summary

### 🟢 Developer Adds Model

1. Fills JSONs for:

   - `model_info`
   - `model_input_config`
   - `model_api_config`

2. Adds it to `models` with tags & slug.
3. Publishes when ready.

---

### 🌐 Frontend Page Generation

- Route: `/models/[slug]`
- Loads all config based on slug → fetches:

  - Info → UI Header, Author, Description, Docs
  - Input config → Form fields
  - Output config → Display mode
  - Blogs → Related section

---

### 🔁 Request Flow (Proxy)

1. User submits input.
2. Backend:

   - Maps `input -> API body/params` using `model_api_config`
   - Sends proxy request
   - Extracts response using `outputMapping`
   - Returns result to frontend.

---

## 🏁 Next Steps

- [ ] Define Mongoose Schemas (next session)
- [ ] Build dynamic Next.js templates with Tailwind
- [ ] Add form builder UI for internal team (optional)
- [ ] Extend with role-based control for edit vs publish

---
