import axios from 'axios';

function transform(md) {
    const lines = md.split('\n');
    let idCounter = 1;
    let result = {
        title: "Awesome Appwrite",
        author: "appwrite",
        publisher: "@AwesomeListBot",
        source: "https://github.com/appwrite/awesome-appwrite",
        items: []
    };
    let currentH2Section = null;
    let currentH3Section = null;
    let previousLineWasHeadingOrText = false;

    lines.forEach(line => {
        if (line.startsWith('## ')) {
            const title = line.substring(3).trim();
            currentH2Section = {
                id: idCounter++,
                type: "Section",
                title,
                items: []
            };
            if (!title.toLowerCase().includes('table of contents')) {
                result.items.push(currentH2Section);
            }
            currentH3Section = null;
            previousLineWasHeadingOrText = true;
        } else if (line.startsWith('* ') || line.startsWith('- ')) {
            const link = extractLinkItem(line.substring(2), idCounter++);
            (currentH3Section || currentH2Section).items.push(link);
            previousLineWasHeadingOrText = false;
        } else if (line.startsWith('### ')) {
            const title = line.substring(4).trim();
            currentH3Section = {
                id: idCounter++,
                type: "Section",
                title: removeMarkdownLinks(title),
                items: []
            };
            currentH2Section.items.push(currentH3Section);
            previousLineWasHeadingOrText = true;
        } else if (line.trim() !== '') {  // <-- Add this check
            if (previousLineWasHeadingOrText && currentH3Section) {
                currentH3Section.description = line.trim();
            } else if (currentH3Section) {
                const subSection = {
                    id: idCounter++,
                    type: "Section",
                    title: removeMarkdownLinks(line.trim()),
                    items: []
                };
                currentH3Section.items.push(subSection);
                currentH3Section = subSection;
            }
        }
    });

    return result;

    function extractLinkItem(line, id) {
        const regex = /\[(.*?)\]\((.*?)\)/g;    
        const links = [];
    
        let noMarkdownLine = line;
        let match;
        while ((match = regex.exec(line)) !== null) {
            links.push({
                id: idCounter++,
                title: match[1],
                url: match[2]
            });
    
            noMarkdownLine = noMarkdownLine.replace(match[0], '');
        }
    
        // If there's bold text in the line, let's assume that's the title and remainder is description
        let title, description;
        if (noMarkdownLine.includes('**')) {
            const split = noMarkdownLine.split('**');
            title = split[1].trim();
            description = split[2].trim();
        } else {
            title = noMarkdownLine;
            description = null;
        }
    
        let link = {
            id,
            type: "Link",
            links
        };
    
        if (title)
            link.title = cleanup(title);
    
        if (description)
            link.description = cleanup(description);
    
        return link;
    
        function cleanup(title) {
            return title.replace(/^[ ,\-|]+/, '').replace(/[ ,\-|]+$/, '');
        }
    }
}

function removeMarkdownLinks(text) {
    return text.replace(/\[(.*?)\]\(.*?\)/g, '$1');
}


const markdown = await axios.get('https://raw.githubusercontent.com/appwrite/awesome-appwrite/master/README.md');
const list = transform(markdown.data);
const json = JSON.stringify(list, null, 2);
console.log(json);
