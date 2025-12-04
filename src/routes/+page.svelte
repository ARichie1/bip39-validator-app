<script lang="ts">
    import type { ApiResult } from '$lib/utils/types';
    import { exampleMnemonic } from '$lib/utils/default';
    
    let showMnemonicField = $state(false)
    let words = $state('');
    let mnemonic = $state('');
    let language = $state('');
    let isCheckingMnemonic = $state(false)
    let loading = $state(false);
    let error: string | null = $state(null);
    let result: ApiResult | null = $state(null);

    let supportedLanguages = []

    const useExample = () => {
        mnemonic = exampleMnemonic;
        words = "max"
        result = null;
        error = null;
    }    

    const validate = async () => {
        error = null;
        result = null;

        if (showMnemonicField) {
            if (!mnemonic.trim()) {
                error = 'Please enter a mnemonic phrase.';
                return;
            }
        }
        else if (!words.trim()){
            error = 'Please enter a word or words.';
            return;
        }
        
        loading = true;

        try {
            const res = await fetch('/api/validate', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({
                    words: words.trim().split(" "),
                    mnemonic,
                    checkMnemonic: showMnemonicField,
                    language: language || undefined})
                }
            )

            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                error = body?.error ?? `Request failed with status ${res.status}`;
                return;
            }

            const data = (await res.json()) as ApiResult;
            result = data
        } catch (e) {
            console.error(e);
            error = 'Network or server error. Please try again.';
        } finally {
            loading = false;
        }
    }

    let statusText = $derived(() => {
        if (result) {
            if (showMnemonicField) {
                return result.valid
                    ? 'Valid mnemonic'
                    : 'Invalid mnemonic'
            }else{
                return (
                    result?.invalidWords && result?.validWords
                        ? (result.invalidWords.length > 0
                            ? (result.invalidWords.length > 1
                                ? "Invalid Words"
                                : "Invalid Word")
                            : (result?.validWords.length > 1
                                ? "Valid Words"
                                : "Valid Word")
                            )
                    : ""
                )
            }   
        }
    })

    let reasonText = $derived(() => {
        if (result) {
            if (showMnemonicField) {
                return (
                    result?.error === "invalid_length"
                    ? "Invalid number of words. BIP-39 supports 12, 15, 18, 21 or 24 words."
                    : result?.error === "unknown_words"
                    ? "One or more words are not in the BIP-39 wordlist."
                    : result?.error === "invalid_checksum"
                    ? "Words are valid but the checksum is wrong."
                    : ""
                )
            }
            else{
                return (
                    result?.error === "invalid_length"
                    ? "You need to add a word or words."
                    : result?.error === "invalid_words"
                    ? "Some words are not valid."
                    : ""
                )
            }
        }
    })
</script>

<section class="page">
    <header class="hero">
        <h1>BIP39 Validator Playground</h1>
        <p>Validate BIP-39 words or mnemonics using the 
            <code>bip39-validator</code> package API.
        </p>
    </header>

    <div class="card">
        <div class="card-header">
             <div class="field">
                <label for="language" class="field-title">Language</label>
                <select id="language" bind:value={language}>
                    <option value="">Auto detect</option>
                    <option value="english">English</option>
                    <option value="spanish">Spanish</option>
                    <option value="french">French</option>
                    <option value="italian">Italian</option>
                    <option value="korean">Korean</option>
                    <option value="chinese_simplified">Chinese (Simplified)</option>
                    <option value="chinese_traditional">Chinese (Traditional)</option>
                </select>
            </div>
            <ul>
                <li><button class="btn"
                    onclick={() => showMnemonicField = false}>Words</button></li>
                <li><button class="btn"
                    onclick={() => showMnemonicField = true}>Mnemonic</button></li>
            </ul>
        </div>
        <div class="card-body">
            {#if !showMnemonicField}
                <label for="words">Check Word or Words</label>
                <textarea id="words" bind:value={words}
                    rows="5" placeholder="Paste your word or words here..."
                ></textarea>
            {:else}
                <label for="mnemonic"> Mnemonic phrase</label>
                <textarea id="mnemonic" bind:value={mnemonic}
                    rows="5" placeholder="Paste your mnemonic here..."
                ></textarea>
            {/if}

            {#if error}
                <p class="alert alert-error">{error}</p>
            {/if}

            <div class="controls">
                <div class="buttons section">
                    <button type="button" onclick={useExample}>Use example</button>
                    <button type="button" class="primary" 
                        onclick={validate} disabled={loading}>
                        {#if loading}
                            Validating...
                        {:else}
                            Validate
                        {/if}
                    </button>
                </div>
            </div>
        </div>


        {#if result}
            <div class="card result">
                <h3>Result</h3>
                <p class:valid={result.valid} class:invalid={!result.valid}>
                    {#if result.valid}
                        ✅ {statusText()}
                    {:else}
                        ✖ {statusText()}
                    {/if}
                </p>

                {#if reasonText}
                    <p class="reason">{reasonText()}</p>
                {/if}


                <h4 class="language">Language used: <strong>{result.language}</strong></h4>


                <h4>Words</h4>
                <div class="words">
                    {#each result.words as w}
                        <span class="word"
                            class:word-invalid={result.invalidWords && result.invalidWords.includes(w)}>
                            {w}
                        </span>
                    {/each}
                </div>

                {#if result.invalidWords && result.invalidWords.length}
                    <h3>Invalid words</h3>
                    <ul>
                        {#each result.invalidWords as w}
                            <li>
                                <code>{w}</code>
                                {#if result.suggestions && result.suggestions[w]?.length}
                                    <span class="suggestions">
                                        – suggestions:
                                        {result.suggestions[w].join(', ')}
                                    </span>
                                {/if}
                            </li>
                        {/each}
                    </ul>
                {/if}
            </div>
        {/if}
    </div>
</section>
