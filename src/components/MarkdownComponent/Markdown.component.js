import React from "react";
import ReactMarkdown from "react-markdown";
import RemarkMathPlugin from "remark-math";
import { BlockMath, InlineMath } from "react-katex";
import "katex/dist/katex.min.css";
import rehypeMathJaxSvg from "rehype-mathjax";
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'

const _mapProps = (props) => ({
   ...props,
   escapeHtml: false,
   remarkPlugins: [RemarkMathPlugin, remarkGfm],
   rehypePlugins: [rehypeMathJaxSvg, rehypeRaw],
   components: {
      ...props.components,
      img: ({node,...props})=><img style={{display: 'block', maxWidth:'50%', height: '500px'}}{...props}/>,
      math: ({ value }) => <BlockMath>{value}</BlockMath>,
      inlineMath: ({ value }) => <InlineMath>{value}</InlineMath>,
   },
});

const Markdown = (props) => <ReactMarkdown {..._mapProps(props)} />;

export default Markdown;