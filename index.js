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

    // DeepSeek V3.2 (let OpenRouter route freely)
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

eventSource.on(
    event_types.CHATCOMPLETION_MODEL_CHANGED,
    (model) => {

        const providers = document.querySelector(
            '#openrouter_providers_chat'
        );

        if (!providers) return;

        if (!providerMap[model]) return;
		console.log(
    'BEFORE',
    oai_settings.openrouter_providers
);



        Array.from(providers.options).forEach(option => {
            option.selected = providerMap[model].includes(
                option.value
            );
        });
		console.log(
    Array.from(providers.selectedOptions)
        .map(o => o.value)
);

        providers.dispatchEvent(
    new Event('change', { bubbles: true })
);

oai_settings.openrouter_providers = [...providerMap[model]];

console.log(
    'FINAL',
    oai_settings.openrouter_providers
);
    }
);

// "Allow fallback routes" is a global checkbox; keep it on only for these models.
const fallbackModels = new Set(['deepseek/deepseek-v3.2']);

eventSource.on(
    event_types.CHATCOMPLETION_MODEL_CHANGED,
    (model) => {
        const wanted = fallbackModels.has(model);
        const box = document.querySelector('#openrouter_use_fallback');
        if (box) {
            box.checked = wanted;
            box.dispatchEvent(new Event('input', { bubbles: true }));
        }
        oai_settings.openrouter_use_fallback = wanted;
    }
);
