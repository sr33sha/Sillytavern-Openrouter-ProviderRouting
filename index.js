import { eventSource, event_types } from '../../../../script.js';
import { oai_settings } from '../../../../scripts/openai.js';

const providerMap = {

    // GLM
    'z-ai/glm-5.3': [
        'Z.AI',
        'Novita',
        'Parasail'
    ],

    'z-ai/glm-5.2': [
        'Z.AI',
        'Novita',
        'Parasail'
    ],

    'z-ai/glm-5.1': [
        'Z.AI',
        'Fireworks',
        'Novita',
        'Parasail',
        'SiliconFlow'
    ],

    'z-ai/glm-4.7': [
        'Z.AI',
        'Novita',
        'Google'
    ],

    'z-ai/glm-4.6': [
        'Z.AI',
        'Novita',
    ],

    // Kimi
'moonshotai/kimi-k3': [
    'Moonshot AI',
    'Fireworks'
],

'moonshotai/kimi-k2.7-code': [
    'Moonshot AI',
    'Parasail',
    'Novita',
],

'moonshotai/kimi-k2.6': [
    'Moonshot AI',
    'Fireworks',
    'Novita',
    'Parasail',
    'SiliconFlow'
],

'moonshotai/kimi-k2.5': [
    'Moonshot AI',
    'Novita',
    'SiliconFlow'
],

    // Gemini Flash
    'google/gemini-3.8-flash': [
        'Google'
    ],

    'google/gemini-3.7-flash': [
        'Google'
    ],

    // Opus
    'anthropic/claude-opus-4.6': [
        'Anthropic',
        'Google'
    ],

    // DeepSeek V3.2 (let OpenRouter route freely across any provider)
    'deepseek/deepseek-v3.2': [],

    // DeepSeek Terminus
    'deepseek/deepseek-v3.1-terminus': [
        'SiliconFlow',
        'Novita'
    ],

    // Gemma
    'google/gemma-4-31b-it': [
        'Parasail',
        'SiliconFlow',
        'Novita'
    ],

    // R1
    'deepseek/deepseek-r1-0528': [
        'SiliconFlow',
        'Novita'
    ],

    // Mimo
    'xiaomi/mimo-v2.5-pro': [
        'Xiaomi',
        'Novita'
    ]
};

// Pin each model's provider order (or leave it empty for free routing, as with V3.2).
eventSource.on(
    event_types.CHATCOMPLETION_MODEL_CHANGED,
    (model) => {

        const providers = document.querySelector(
            '#openrouter_providers_chat'
        );

        if (!providers) return;

        if (!providerMap[model]) return;

        Array.from(providers.options).forEach(option => {
            option.selected = providerMap[model].includes(
                option.value
            );
        });

        providers.dispatchEvent(
            new Event('change', { bubbles: true })
        );

        oai_settings.openrouter_providers = [...providerMap[model]];
    }
);

// Provider-level fallback ("Allow fallback providers"), NOT model-level fallback
// ("Allow fallback routes" — that swaps to a different LLM entirely, never wanted here).
// Only DeepSeek V3.2 gets free rein to fall back across any provider serving it.
// Every other model stays hard-locked to its providerMap list above, on purpose.
const freeRoutingModels = new Set(['deepseek/deepseek-v3.2']);

eventSource.on(
    event_types.CHATCOMPLETION_MODEL_CHANGED,
    (model) => {
        const wanted = freeRoutingModels.has(model);
        const box = document.querySelector('#openrouter_allow_fallbacks');
        if (box) {
            box.checked = wanted;
            box.dispatchEvent(new Event('input', { bubbles: true }));
        }
        oai_settings.openrouter_allow_fallbacks = wanted;
    }
);
