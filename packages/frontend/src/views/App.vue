<script setup lang="ts">
import Button from "primevue/button";
import Dropdown from "primevue/dropdown";
import Textarea from "primevue/textarea";
import Checkbox from "primevue/checkbox";
import FileUpload from "primevue/fileupload";
import { ref, onMounted } from "vue";

import { useSDK } from "@/plugins/sdk";
import type { ConversionType } from "@/types";

// Retrieve the SDK instance to interact with the backend
const sdk = useSDK();

// Conversion window interface
interface ConversionWindow {
  id: number;
  inputText: string;
  outputText: string;
  selectedConversion: ConversionType | null;
  isLoading: boolean;
  errorMessage: string;
  perLineMode: boolean;
  usePrefix: boolean;
  useSuffix: boolean;
  prefixText: string;
  suffixText: string;
}

// Reactive state
const conversionWindows = ref<ConversionWindow[]>([
  {
    id: 1,
    inputText: "",
    outputText: "",
    selectedConversion: null,
    isLoading: false,
    errorMessage: "",
    perLineMode: false,
    usePrefix: false,
    useSuffix: false,
    prefixText: "",
    suffixText: ""
  }
]);
const conversionTypes = ref<ConversionType[]>([]);
const nextWindowId = ref(2);

// Load conversion types on mount
onMounted(async () => {
  const result = await sdk.backend.getConversionTypes();
  if (result.kind === "Ok") {
    conversionTypes.value = result.value;
  }
});

// Add new conversion window
const addConversionWindow = () => {
  conversionWindows.value.push({
    id: nextWindowId.value++,
    inputText: "",
    outputText: "",
    selectedConversion: null,
    isLoading: false,
    errorMessage: "",
    perLineMode: false,
    usePrefix: false,
    useSuffix: false,
    prefixText: "",
    suffixText: ""
  });
};

// Remove conversion window
const removeConversionWindow = (windowId: number) => {
  if (conversionWindows.value.length > 1) {
    conversionWindows.value = conversionWindows.value.filter(w => w.id !== windowId);
  }
};

// Handle conversion for a specific window
const handleConvert = async (window: ConversionWindow) => {
  if (!window.selectedConversion || !window.inputText.trim()) {
    window.errorMessage = "Please select a conversion type and enter input text";
    return;
  }

  window.isLoading = true;
  window.errorMessage = "";

  try {
    const result = await sdk.backend.convert(
      window.inputText,
      window.selectedConversion.id,
      window.perLineMode,
      window.usePrefix ? window.prefixText : "",
      window.useSuffix ? window.suffixText : ""
    );

    if (result.kind === "Ok") {
      window.outputText = result.value;
      sdk.window.showToast("Conversion completed successfully!", {
        variant: "success"
      });
    } else {
      window.errorMessage = result.error;
      sdk.window.showToast(result.error, { variant: "error" });
    }
  } catch (error) {
    window.errorMessage = `Conversion failed: ${error}`;
    sdk.window.showToast(`Conversion failed: ${error}`, { variant: "error" });
  } finally {
    window.isLoading = false;
  }
};

// Send output to next window
const sendToNextWindow = (currentWindow: ConversionWindow) => {
  const currentIndex = conversionWindows.value.findIndex(w => w.id === currentWindow.id);
  if (currentIndex < conversionWindows.value.length - 1) {
    const nextWindow = conversionWindows.value[currentIndex + 1];
    nextWindow.inputText = currentWindow.outputText;
  } else {
    // Create new window if this is the last one
    addConversionWindow();
    const newWindow = conversionWindows.value[conversionWindows.value.length - 1];
    newWindow.inputText = currentWindow.outputText;
  }
};

// Clear specific window
const clearWindow = (window: ConversionWindow) => {
  window.inputText = "";
  window.outputText = "";
  window.selectedConversion = null;
  window.errorMessage = "";
  window.usePrefix = false;
  window.useSuffix = false;
  window.prefixText = "";
  window.suffixText = "";
};

// Get preview text with prefix/suffix applied
const getPreviewText = (window: ConversionWindow) => {
  let preview = window.inputText;
  if (window.usePrefix && window.prefixText) {
    if (window.perLineMode) {
      const lines = preview.split('\n');
      preview = lines.map(line => `${window.prefixText}${line}`).join('\n');
    } else {
      preview = `${window.prefixText}${preview}`;
    }
  }
  if (window.useSuffix && window.suffixText) {
    if (window.perLineMode) {
      const lines = preview.split('\n');
      preview = lines.map(line => `${line}${window.suffixText}`).join('\n');
    } else {
      preview = `${preview}${window.suffixText}`;
    }
  }
  return preview;
};

// Handle file upload for first window
const handleFileUpload = async (event: any, window: ConversionWindow) => {
  const file = event.target.files[0];
  if (file) {
    try {
      const text = await file.text();
      const result = await sdk.backend.handleFileUpload(text, file.name);
      if (result.kind === "Ok") {
        window.inputText = result.value;
        sdk.window.showToast("File loaded successfully!", { variant: "success" });
      } else {
        sdk.window.showToast(result.error, { variant: "error" });
      }
    } catch (error) {
      sdk.window.showToast("Failed to load file", { variant: "error" });
    }
  }
};


// Copy output to clipboard
const copyOutput = async (outputText: string) => {
  if (outputText) {
    try {
      await navigator.clipboard.writeText(outputText);
      sdk.window.showToast("Output copied to clipboard!", { variant: "success" });
    } catch (error) {
      sdk.window.showToast("Failed to copy to clipboard", { variant: "error" });
    }
  }
};

// Swap input and output for a window
const swapWindow = (window: ConversionWindow) => {
  const temp = window.inputText;
  window.inputText = window.outputText;
  window.outputText = temp;
};
</script>

<template>
  <div class="h-full w-full bg-surface-0 flex flex-col" style="background-color: var(--surface-0) !important;">
    <!-- Header -->
    <div class="flex items-center justify-between p-3 border-b border-surface-200">
      <div>
        <h1 class="text-lg font-semibold" style="color: var(--surface-900) !important;">Converter Chain</h1>
        <p class="text-xs" style="color: var(--surface-600) !important;">Chain multiple conversions together</p>
      </div>
      <div class="flex gap-2">
        <!-- File upload for initial step -->
        <div class="relative">
          <input
            type="file"
            ref="fileInput"
            @change="(event) => handleFileUpload(event, conversionWindows[0])"
            accept="text/*,.txt,.json,.xml,.csv"
            style="display: none;"
          />
          <Button
            label="Upload"
            size="small"
            severity="secondary"
            @click="() => $refs.fileInput.click()"
            v-tooltip="'Upload local file'"
          />
        </div>
        <Button
          label="Add Window"
          size="small"
          @click="addConversionWindow"
        />
      </div>
    </div>

    <!-- Conversion Windows -->
    <div class="flex-1 overflow-y-auto p-3 space-y-3" style="background-color: var(--surface-0) !important;">
      <div
        v-for="(window, index) in conversionWindows"
        :key="window.id"
        class="bg-surface-100 border border-surface-300 rounded-lg p-2"
        style="background-color: var(--surface-100) !important;"
      >
        <!-- Window Header -->
        <div class="flex items-center justify-between mb-2">
          <div class="flex items-center gap-2">
            <span class="text-xs font-medium" style="color: var(--surface-900) !important;">Step {{ index + 1 }}</span>
            <Button
              v-if="conversionWindows.length > 1"
              label="Remove"
              size="small"
              severity="danger"
              @click="removeConversionWindow(window.id)"
            />
          </div>
          <div class="flex gap-1">
            <Button
              label="Clear"
              size="small"
              severity="secondary"
              @click="clearWindow(window)"
              v-tooltip="'Clear window'"
            />
            <Button
              label="Swap"
              size="small"
              severity="secondary"
              @click="swapWindow(window)"
              v-tooltip="'Swap input/output'"
            />
          </div>
        </div>

        <!-- Conversion Type Selection -->
        <div class="mb-2">
          <div class="flex items-center gap-2 mb-1">
            <i class="pi pi-cog text-xs" style="color: var(--surface-600) !important;"></i>
            <span class="text-xs font-medium" style="color: var(--surface-900) !important;">Conversion Type</span>
          </div>
          <Dropdown
            v-model="window.selectedConversion"
            :options="conversionTypes"
            option-label="name"
            placeholder="Select conversion type"
            class="w-full"
            :loading="conversionTypes.length === 0"
            filter
            filter-placeholder="Type to search..."
            show-clear
          />
          <div v-if="window.selectedConversion" class="text-xs mt-1" style="color: var(--surface-600) !important;">
            {{ window.selectedConversion.description }}
          </div>
          
          <!-- Per-line mode checkbox -->
          <div class="flex items-center gap-2 mt-1">
            <Checkbox v-model="window.perLineMode" :binary="true" />
            <label class="text-xs" style="color: var(--surface-700) !important;">Process each line separately</label>
          </div>
        </div>

        <!-- Input/Output Areas -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
          <!-- Input Area -->
          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-1">
                <i class="pi pi-arrow-down text-xs" style="color: var(--surface-600) !important;"></i>
                <span class="text-xs font-medium" style="color: var(--surface-900) !important;">Input</span>
              </div>
            </div>
            
            <!-- Input Textarea with Preview -->
            <div class="relative w-full">
              <Textarea
                v-model="window.inputText"
                placeholder="Enter your text here..."
                class="w-full h-32 font-mono text-xs resize-none"
                :disabled="window.isLoading"
                style="width: 100% !important; height: 20vw !important;"
              />
              <!-- Preview overlay when prefix/suffix is active -->
              <div 
                v-if="(window.usePrefix && window.prefixText) || (window.useSuffix && window.suffixText)"
                class="absolute inset-0 bg-surface-100 border border-surface-300 rounded p-1 pointer-events-none"
              >
                <div class="text-xs font-mono text-surface-600 mb-1">Preview:</div>
                <pre class="text-xs font-mono text-surface-800 whitespace-pre-wrap overflow-auto h-full">{{ getPreviewText(window) }}</pre>
              </div>
            </div>
          </div>

          <!-- Output Area -->
          <div class="flex flex-col">
            <div class="flex items-center justify-between mb-1">
              <div class="flex items-center gap-1">
                <i class="pi pi-arrow-up text-xs" style="color: var(--surface-600) !important;"></i>
                <span class="text-xs font-medium" style="color: var(--surface-900) !important;">Output</span>
              </div>
              <div class="flex gap-1">
                <Button
                  label="Copy"
                  size="small"
                  severity="secondary"
                  @click="copyOutput(window.outputText)"
                  :disabled="!window.outputText"
                  v-tooltip="'Copy output'"
                  style="min-width: 32px; min-height: 32px;"
                />
                <Button
                  label="Add Step"
                  size="small"
                  severity="secondary"
                  @click="sendToNextWindow(window)"
                  :disabled="!window.outputText"
                  v-tooltip="'Add new step with this output'"
                  style="min-width: 32px; min-height: 32px;"
                />
              </div>
            </div>
            <Textarea
              v-model="window.outputText"
              placeholder="Converted text will appear here..."
              class="w-full h-32 font-mono text-xs resize-none"
              readonly
              style="width: 100% !important; height: 20vw !important;"
            />
          </div>
        </div>

        <!-- Error Message -->
        <div v-if="window.errorMessage" class="mt-2 p-2 bg-red-50 border border-red-200 rounded">
          <div class="flex items-center gap-2 text-red-700">
            <i class="pi pi-exclamation-triangle text-xs"></i>
            <span class="text-xs">{{ window.errorMessage }}</span>
          </div>
        </div>

        <!-- EDITOR Section -->
        <div class="mt-2 p-2 bg-surface-200 border border-surface-400 rounded" style="background-color: var(--surface-200) !important;">
          <div class="flex items-center gap-2 mb-1">
            <i class="pi pi-edit text-xs" style="color: var(--surface-600) !important;"></i>
            <span class="text-xs font-medium" style="color: var(--surface-900) !important;">EDITOR</span>
          </div>
          
          <!-- Prefix/Suffix Options -->
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <!-- Prefix Section -->
            <div class="flex flex-col">
              <div class="flex items-center gap-2 mb-1">
                <Checkbox v-model="window.usePrefix" :binary="true" />
                <label class="text-xs" style="color: var(--surface-700) !important;">Prefix</label>
              </div>
              <Textarea
                v-if="window.usePrefix"
                v-model="window.prefixText"
                placeholder="Enter prefix text..."
                class="h-12 font-mono text-xs resize-none"
              />
            </div>

            <!-- Suffix Section -->
            <div class="flex flex-col">
              <div class="flex items-center gap-2 mb-1">
                <Checkbox v-model="window.useSuffix" :binary="true" />
                <label class="text-xs" style="color: var(--surface-700) !important;">Suffix</label>
              </div>
              <Textarea
                v-if="window.useSuffix"
                v-model="window.suffixText"
                placeholder="Enter suffix text..."
                class="h-12 font-mono text-xs resize-none"
              />
            </div>
          </div>

        </div>

        <!-- Convert Button -->
        <div class="flex justify-center mt-2">
          <Button
            label="Convert"
            size="small"
            :loading="window.isLoading"
            :disabled="!window.selectedConversion || !window.inputText.trim()"
            @click="handleConvert(window)"
          />
        </div>
      </div>
    </div>
  </div>
</template>
