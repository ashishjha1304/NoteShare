const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
    fs.readdirSync(dir).forEach(file => {
        const dirFile = path.join(dir, file);
        if (fs.statSync(dirFile).isDirectory()) {
            if (!dirFile.includes('node_modules') && !dirFile.includes('.next')) {
                filelist = walkSync(dirFile, filelist);
            }
        } else {
            if (dirFile.endsWith('.js')) {
                filelist.push(dirFile);
            }
        }
    });
    return filelist;
};

const map = {
    // Backgrounds
    'bg-surface-950': 'bg-surface-50 dark:bg-surface-950',
    'bg-surface-900': 'bg-white dark:bg-surface-900',
    'bg-surface-800': 'bg-surface-100 dark:bg-surface-800',
    // Borders
    'border-surface-800': 'border-surface-200 dark:border-surface-800',
    'border-surface-700': 'border-surface-300 dark:border-surface-700',
    // Text
    'text-surface-500': 'text-surface-400 dark:text-surface-500',
    'text-surface-400': 'text-surface-600 dark:text-surface-400',
    'text-surface-300': 'text-surface-700 dark:text-surface-300',
    'hover:text-surface-300': 'hover:text-surface-900 dark:hover:text-surface-300',
    'placeholder-surface-500': 'placeholder-surface-400 dark:placeholder-surface-500',
    'hover:border-surface-600': 'hover:border-surface-300 dark:hover:border-surface-600',
    // Opacities
    'bg-surface-900/60': 'bg-white/60 dark:bg-surface-900/60',
    'bg-surface-900/50': 'bg-white/50 dark:bg-surface-900/50',
    'bg-surface-900/30': 'bg-white/30 dark:bg-surface-900/30',
    'bg-surface-800/60': 'bg-surface-100/60 dark:bg-surface-800/60',
    'bg-surface-800/50': 'bg-surface-100/50 dark:bg-surface-800/50',
    'bg-surface-800/40': 'bg-surface-100/40 dark:bg-surface-800/40',
    'bg-surface-800/30': 'bg-surface-100/30 dark:bg-surface-800/30',
    'bg-surface-800/20': 'bg-surface-100/20 dark:bg-surface-800/20',
    'border-surface-800/50': 'border-surface-200/50 dark:border-surface-800/50',
    'border-surface-800/30': 'border-surface-200/30 dark:border-surface-800/30',
    'border-surface-800/20': 'border-surface-200/20 dark:border-surface-800/20',
    'border-surface-700/50': 'border-surface-300/50 dark:border-surface-700/50',
    'border-surface-700/30': 'border-surface-300/30 dark:border-surface-700/30',
    'bg-primary-950/50': 'bg-primary-50/50 dark:bg-primary-950/50',
    'bg-accent-950/50': 'bg-accent-50/50 dark:bg-accent-950/50',
};

const whiteTextMap = 'text-surface-900 dark:text-white';

const files = walkSync('d:/Online Notes Website/frontend');

files.forEach(file => {
    let text = fs.readFileSync(file, 'utf8');
    let original = text;

    // Protect already processed variants if script is run twice
    if (text.includes('dark:bg-surface-950')) return;

    // Process standard surface mappings
    for (const [key, value] of Object.entries(map)) {
        const rx = new RegExp(`\\b${key.replace(/[/]/g, '\\\\/')}(?![/a-zA-Z0-9])`, 'g');
        text = text.replace(rx, value);
    }

    // Handle text-white mapping based on context
    text = text.replace(/className=(["`])([^"`]*)\1/g, (match, quote, classes) => {
        let newClasses = classes;
        // Ignore text-white replacements if inside a solid color background / gradient
        if (!classes.includes('bg-gradient') &&
            !classes.includes('bg-primary') &&
            !classes.includes('bg-accent') &&
            !classes.includes('bg-blue-') &&
            !classes.includes('bg-emerald-') &&
            !classes.includes('bg-amber-') &&
            !classes.includes('bg-violet-') &&
            !classes.includes('bg-rose-')) {

            newClasses = newClasses.replace(/\btext-white\b/g, whiteTextMap);
            newClasses = newClasses.replace(/\bhover:text-white\b/g, 'hover:text-surface-900 dark:hover:text-white');
        }
        return `className=${quote}${newClasses}${quote}`;
    });

    if (text !== original) {
        fs.writeFileSync(file, text);
        console.log(`Updated ${file}`);
    }
});
