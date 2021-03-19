import remark from 'remark'
import html from 'remark-html'
import slug from 'remark-slug'
import toc from 'mdast-util-toc'
import normalize from 'mdurl/encode'
import all from 'mdast-util-to-hast/lib/all'
import highlight from 'remark-highlight.js'
import low from 'lowlight/lib/core'
import javascript from 'highlight.js/lib/languages/javascript'

low.registerLanguage('tsx', javascript)

function mytoc() {
  return (tree: any) => {
    const ast = toc(tree, {
      maxDepth: 6,
      tight: true,
    })
    if (ast.map) {
      tree.children = [ast.map]
    } else {
      tree.children = []
    }
  }
}

export function markdownToToc(markdown: string) {
  try {
    const result = remark().use(slug).use(mytoc).use(html).processSync(markdown)
    return result.toString()
  } catch (error) {
    return 'remark 编译 错误'
  }
}

export function markdownToHtml(markdown: string) {
  try {
    const result = remark()
      .use(slug)
      .use(highlight)
      .use(html, {
        handlers: {
          link: (h, node: any) => {
            const props = {
              title: undefined,
              target: '_blank',
              rel: 'nofollow',
              href: normalize(node.url),
            }
            if (node.title !== null && node.title !== undefined) {
              props.title = node.title
            }
            return h(node, 'a', props, all(h, node))
          },
          code: (h, node) => ({
            type: 'element',
            tagName: 'pre',
            properties: {
              className: ['custom'],
            },
            children: [h(node, 'code')],
          }),
        },
      })
      .processSync(markdown)
    return result.toString()
  } catch (error) {
    if (error && /Unknown language/.test(error.message)) {
      return
    }
    throw error
  }
}
