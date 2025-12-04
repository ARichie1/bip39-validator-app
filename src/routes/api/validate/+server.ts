import type { RequestHandler } from '@sveltejs/kit';
import { validateMnemonicServer, validateWordsServer } from '$lib/server/bip39Validator';

export const POST: RequestHandler = async ({ request }) => {
    let result;
    try {
        const {words, mnemonic, checkMnemonic, language } = await request.json();

        if (checkMnemonic) {
            if (typeof mnemonic !== 'string' || !mnemonic.trim()) {
                return new Response(
                    JSON.stringify({ error: 'Mnemonic is required' }), { 
                        status: 400, 
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
            }
            result = validateMnemonicServer(mnemonic, language);
        }else{
            console.log(words);
            
            if (typeof words !== 'object') {
                return new Response(
                    JSON.stringify({ error: 'Enter a Word or Words.' }), { 
                        status: 400, 
                        headers: { 'Content-Type': 'application/json' }
                    }
                )
            }
            result = validateWordsServer(words, language);
            console.log(result);   
        }
        

        return new Response(
            JSON.stringify(result), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        )
    } catch (err) {
        console.error('Validation error:', err);
        return new Response(
            JSON.stringify({ error: 'Unexpected error validating mnemonic' }), { 
                status: 500, 
                headers: { 'Content-Type': 'application/json' }
            }
        )
    }
}