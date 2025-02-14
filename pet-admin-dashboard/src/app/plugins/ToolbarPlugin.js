'use client';

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  FORMAT_ELEMENT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $createParagraphNode,
  $getNodeByKey,
} from "lexical";
import { $isLinkNode, TOGGLE_LINK_COMMAND } from "@lexical/link";
import {
  $isParentElementRTL,
  $wrapNodes,
  $isAtNodeEnd,
} from "@lexical/selection";
import { $getNearestNodeOfType, mergeRegister } from "@lexical/utils";
import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
  REMOVE_LIST_COMMAND,
  $isListNode,
  ListNode,
} from "@lexical/list";
import { createPortal } from "react-dom";
import {
  $createHeadingNode,
  $createQuoteNode,
  $isHeadingNode,
} from "@lexical/rich-text";
import {
  $createCodeNode,
  $isCodeNode,
  getDefaultCodeLanguage,
  getCodeLanguages,
} from "@lexical/code";

import {$generateHtmlFromNodes, $generateNodesFromDOM} from "@lexical/html";
import '../globals.css'

const ICON_PATHS = {
  paragraph: '/icons/text-paragraph.svg',
  h1: '/icons/type-h1.svg',
  h2: '/icons/type-h2.svg',
  bold: '/icons/type-bold.svg',
  italic: '/icons/type-italic.svg',
  underline: '/icons/type-underline.svg',
  strikethrough: '/icons/type-strikethrough.svg',
  code: '/icons/code.svg',
  link: '/icons/link.svg',
  undo: '/icons/arrow-counterclockwise.svg',
  redo: '/icons/arrow-clockwise.svg',
  alignLeft: '/icons/text-left.svg',
  alignCenter: '/icons/text-center.svg',
  alignRight: '/icons/text-right.svg',
  alignJustify: '/icons/justify.svg',
  bulletList: '/icons/list-ul.svg',
  numberedList: '/icons/list-ol.svg',
  quote: '/icons/chat-square-quote.svg',
  incresetextsize: '/icons/',
};

const iconStyles = {
  filter: 'invert(1)', // Makes black SVGs white
  opacity: 0.9
};

const LowPriority = 1;

const supportedBlockTypes = new Set([
  "paragraph",
  "quote",
  "code",
  "h1",
  "h2",
  "ul",
  "ol",
]);

const blockTypeToBlockName = {
  code: "Code Block",
  h1: "Large Heading",
  h2: "Small Heading",
  h3: "Heading",
  h4: "Heading",
  h5: "Heading",
  ol: "Numbered List",
  paragraph: "Normal",
  quote: "Quote",
  ul: "Bulleted List",
};

function Divider() {
  return <div className="border-r border-zinc-600 mx-2 h-6" />;
}

function positionEditorElement(editor, rect) {
  if (rect === null) {
    editor.style.opacity = "0";
    editor.style.top = "-1000px";
    editor.style.left = "-1000px";
  } else {
    editor.style.opacity = "1";
    editor.style.top = `${rect.top + rect.height + window.pageYOffset + 10}px`;
    editor.style.left = `${
      rect.left + window.pageXOffset - editor.offsetWidth / 2 + rect.width / 2
    }px`;
  }
}

function FloatingLinkEditor({ editor }) {
  const editorRef = useRef(null);
  const inputRef = useRef(null);
  // const [editor] = useLexicalComposerContext();
  const mouseDownRef = useRef(false);
  const [linkUrl, setLinkUrl] = useState("");
  const [isEditMode, setEditMode] = useState(false);
  const [lastSelection, setLastSelection] = useState(null);

  useEffect(() => {
    const unregister = mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          // Save the editor state to localStorage
          const serializedState = JSON.stringify(editorState);
          localStorage.setItem("editorState", serializedState);
          console.log("Editor state saved:", serializedState);
        });
      })
    );

    return () => {
      unregister();
    };
  }, [editor]);

  const updateLinkEditor = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent)) {
        setLinkUrl(parent.getURL());
      } else if ($isLinkNode(node)) {
        setLinkUrl(node.getURL());
      } else {
        setLinkUrl("");
      }
    }
    const editorElem = editorRef.current;
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (editorElem === null) {
      return;
    }

    const rootElement = editor.getRootElement();
    if (
      selection !== null &&
      !nativeSelection.isCollapsed &&
      rootElement !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const domRange = nativeSelection.getRangeAt(0);
      let rect;
      if (nativeSelection.anchorNode === rootElement) {
        let inner = rootElement;
        while (inner.firstElementChild != null) {
          inner = inner.firstElementChild;
        }
        rect = inner.getBoundingClientRect();
      } else {
        rect = domRange.getBoundingClientRect();
      }

      if (!mouseDownRef.current) {
        positionEditorElement(editorElem, rect);
      }
      setLastSelection(selection);
    } else if (!activeElement || activeElement.className !== "link-input") {
      positionEditorElement(editorElem, null);
      setLastSelection(null);
      setEditMode(false);
      setLinkUrl("");
    }

    return true;
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateLinkEditor();
        });
      }),

      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateLinkEditor();
          return true;
        },
        LowPriority
      )
    );
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      updateLinkEditor();
    });
  }, [editor, updateLinkEditor]);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  return (
    <div ref={editorRef} className="link-editor">
      {isEditMode ? (
        <input
          ref={inputRef}
          className="link-input"
          value={linkUrl}
          onChange={(event) => {
            setLinkUrl(event.target.value);
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              if (lastSelection !== null) {
                if (linkUrl !== "") {
                  editor.dispatchCommand(TOGGLE_LINK_COMMAND, linkUrl);
                }
                setEditMode(false);
              }
            } else if (event.key === "Escape") {
              event.preventDefault();
              setEditMode(false);
            }
          }}
        />
      ) : (
        <>
          <div className="link-input">
            <a href={linkUrl} target="_blank" rel="noopener noreferrer">
              {linkUrl}
            </a>
            <div
              className="link-edit"
              role="button"
              tabIndex={0}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setEditMode(true);
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}

function Select({ onChange, className, options, value }) {
  return (
    <select className={className} onChange={onChange} value={value}>
      <option hidden={true} value="" />
      {options.map((option) => (
        <option key={option} value={option}>
          {option}
        </option>
      ))}
    </select>
  );
}

function getSelectedNode(selection) {
  const anchor = selection.anchor;
  const focus = selection.focus;
  const anchorNode = selection.anchor.getNode();
  const focusNode = selection.focus.getNode();
  if (anchorNode === focusNode) {
    return anchorNode;
  }
  const isBackward = selection.isBackward();
  if (isBackward) {
    return $isAtNodeEnd(focus) ? anchorNode : focusNode;
  } else {
    return $isAtNodeEnd(anchor) ? focusNode : anchorNode;
  }
}

function BlockOptionsDropdownList({
  editor,
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}) {
  const dropDownRef = useRef(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event) => {
        const target = event.target;

        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener("click", handle);

      return () => {
        document.removeEventListener("click", handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  const formatParagraph = () => {
    if (blockType !== "paragraph") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createParagraphNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatLargeHeading = () => {
    if (blockType !== "h1") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h1"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatSmallHeading = () => {
    if (blockType !== "h2") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createHeadingNode("h2"));
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatBulletList = () => {
    if (blockType !== "ul") {
      editor.dispatchCommand(INSERT_UNORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatNumberedList = () => {
    if (blockType !== "ol") {
      editor.dispatchCommand(INSERT_ORDERED_LIST_COMMAND);
    } else {
      editor.dispatchCommand(REMOVE_LIST_COMMAND);
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatQuote = () => {
    if (blockType !== "quote") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createQuoteNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  const formatCode = () => {
    if (blockType !== "code") {
      editor.update(() => {
        const selection = $getSelection();

        if ($isRangeSelection(selection)) {
          $wrapNodes(selection, () => $createCodeNode());
        }
      });
    }
    setShowBlockOptionsDropDown(false);
  };

  return (
    <div className="absolute z-10 top-full left-0 mt-2 rounded-lg bg-zinc-800 shadow-lg border border-zinc-700" ref={dropDownRef}>
      <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700" onClick={formatParagraph}>
        <span className="w-6 h-6 mr-2 flex items-center justify-center">
          <img src={ICON_PATHS.paragraph} alt="Paragraph" className="w-5 h-5" style={iconStyles} />
        </span>
        <span>Normal</span>
        {blockType === "paragraph" && <span className="ml-auto "><i className="ri-check-line"></i></span>}
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700" onClick={formatLargeHeading}>
        <span className="w-6 h-6 mr-2 flex items-center justify-center">
          <img src={ICON_PATHS.h1} alt="Large Heading" className="w-5 h-5" style={iconStyles} />
        </span>
        <span>Large Heading</span>
        {blockType === "h1" && <span className="ml-auto "><i className="ri-check-line"></i></span>}
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700" onClick={formatSmallHeading}>
        <span className="w-6 h-6 mr-2 flex items-center justify-center">
          <img src={ICON_PATHS.h2} alt="Small Heading" className="w-5 h-5" style={iconStyles} />
        </span>
        <span>Small Heading</span>
        {blockType === "h2" && <span className="ml-auto "><i className="ri-check-line"></i></span>}
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700" onClick={formatBulletList}>
        <span className="w-6 h-6 mr-2 flex items-center justify-center">
          <img src={ICON_PATHS.bulletList} alt="Bullet List" className="w-5 h-5" style={iconStyles} />
        </span>
        <span>Bullet List</span>
        {blockType === "ul" && <span className="ml-auto "><i className="ri-check-line"></i></span>}
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700" onClick={formatNumberedList}>
        <span className="w-6 h-6 mr-2 flex items-center justify-center">
          <img src={ICON_PATHS.numberedList} alt="Numbered List" className="w-5 h-5" style={iconStyles} />
        </span>
        <span>Numbered List</span>
        {blockType === "ol" && <span className="ml-auto "><i className="ri-check-line"></i></span>}
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700" onClick={formatQuote}>
        <span className="w-6 h-6 mr-2 flex items-center justify-center">
          <img src={ICON_PATHS.quote} alt="Quote" className="w-5 h-5" style={iconStyles} />
        </span>
        <span>Quote</span>
        {blockType === "quote" && <span className="ml-auto "><i className="ri-check-line"></i></span>}
      </button>
      <button className="flex items-center w-full px-4 py-2 text-sm text-zinc-300 hover:bg-zinc-700" onClick={formatCode}>
        <span className="w-6 h-6 mr-2 flex items-center justify-center">
          <img src={ICON_PATHS.code} alt="Code Block" className="w-5 h-5" style={iconStyles} />
        </span>
        <span>Code Block</span>
        {blockType === "code" && <span className="ml-auto "><i className="ri-check-line"></i></span>}
      </button>
    </div>
  );
}

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState("paragraph");
  const [selectedElementKey, setSelectedElementKey] = useState(null);
  const [showBlockOptionsDropDown, setShowBlockOptionsDropDown] =
    useState(false);
  const [codeLanguage, setCodeLanguage] = useState("");
  const [isRTL, setIsRTL] = useState(false);
  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikethrough, setIsStrikethrough] = useState(false);
  const [isCode, setIsCode] = useState(false);
  const [textSize, setTextSize] = useState(16); // Default text size
  const [fontSizeChange, setFontSizeChange] = useState(1); // Default font size change

    // AutoSave Logic - Save as HTML (DOM structure)
    useEffect(() => {
      const savedHTML = localStorage.getItem("editorContentHTML");
  
      // Load saved HTML into the editor
      if (savedHTML) {
        editor.update(() => {
          const parser = new DOMParser();
          const dom = parser.parseFromString(savedHTML, "text/html");
          const nodes = $generateNodesFromDOM(editor, dom);
          const root = editor.getRootElement();
          // root.clear();
          root.append(...nodes);
        });
      }
  
      // Save the editor state as HTML on updates
      const unregister = editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          const htmlContent = $generateHtmlFromNodes(editor, null); // Generate HTML
          localStorage.setItem("editorContentHTML", htmlContent);
          console.log("Editor content saved as HTML:", htmlContent);
        });
      });
  
      return () => {
        unregister();
      };
    }, [editor]);
  

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === "root"
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        setSelectedElementKey(elementKey);
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType(anchorNode, ListNode);
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
          if ($isCodeNode(element)) {
            setCodeLanguage(element.getLanguage() || getDefaultCodeLanguage());
          }
        }
      }
      // Update text format
      setIsBold(selection.hasFormat("bold"));
      setIsItalic(selection.hasFormat("italic"));
      setIsUnderline(selection.hasFormat("underline"));
      setIsStrikethrough(selection.hasFormat("strikethrough"));
      setIsCode(selection.hasFormat("code"));
      setIsRTL($isParentElementRTL(selection));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      if ($isLinkNode(parent) || $isLinkNode(node)) {
        setIsLink(true);
      } else {
        setIsLink(false);
      }
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => {
          updateToolbar();
        });
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        (_payload, newEditor) => {
          updateToolbar();
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority
      ),
      editor.registerCommand(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority
      )
    );
  }, [editor, updateToolbar]);

  const codeLanguges = useMemo(() => (typeof window !== "undefined" ? getCodeLanguages() : []), []);
  const onCodeLanguageSelect = useCallback(
    (e) => {
      editor.update(() => {
        if (selectedElementKey !== null) {
          const node = $getNodeByKey(selectedElementKey);
          if ($isCodeNode(node)) {
            node.setLanguage(e.target.value);
          }
        }
      });
    },
    [editor, selectedElementKey]
  );

  const insertLink = useCallback(() => {
    if (!isLink) {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, "https://");
    } else {
      editor.dispatchCommand(TOGGLE_LINK_COMMAND, null);
    }
  }, [editor, isLink]);

  const increaseTextSize = useCallback(() => {
    const sizeChange = Math.min(fontSizeChange, 72); // Ensure fontSizeChange doesn't exceed 72
    setTextSize((prevSize) => Math.min(prevSize + sizeChange, 72)); // Cap the font size at 72px

    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.getType() === "text") {
            const newSize = Math.min(textSize + sizeChange, 72); // Cap the font size at 72px
            node.setStyle(`font-size: ${newSize}px`);
          }
        });
      }
    });
  }, [editor, textSize, fontSizeChange]);

  const decreaseTextSize = useCallback(() => {
    setTextSize((prevSize) => Math.max(prevSize - fontSizeChange, 1));
    editor.update(() => {
      const selection = $getSelection();
      if ($isRangeSelection(selection)) {
        selection.getNodes().forEach((node) => {
          if (node.getType() === "text") {
            node.setStyle(`font-size: ${textSize - fontSizeChange}px`);
          }
        });
      }
    });
  }, [editor, textSize, fontSizeChange]);

  useEffect(() => {}, [editor, textSize, fontSizeChange]);

  return (
    <>
    <div className="flex flex-wrap items-center p-2 mb-px w-full 
      bg-zinc-800 rounded-t-xl border border-zinc-700 
      shadow-md"
      ref={toolbarRef}>
      <button
        disabled={!canUndo}
        onClick={() => {
          editor.dispatchCommand(UNDO_COMMAND);
        }}
        className="toolbar-item p-2 rounded hover:bg-zinc-700 disabled:opacity-50 text-zinc-400"
        aria-label="Undo"
      >
        <img src={ICON_PATHS.undo} alt="Undo" className="w-5 h-5" style={iconStyles} />
      </button>
      <button
        disabled={!canRedo}
        onClick={() => {
          editor.dispatchCommand(REDO_COMMAND);
        }}
        className="toolbar-item p-2 rounded hover:bg-zinc-700 disabled:opacity-50 text-zinc-400"
        aria-label="Redo"
      >
        <img src={ICON_PATHS.redo} alt="Redo" className="w-5 h-5" style={iconStyles} />
      </button>
      <Divider />
      {supportedBlockTypes.has(blockType) && (
        <>
          <button
            className="toolbar-item block-controls flex items-center p-2 rounded hover:bg-zinc-700 text-zinc-400"
            onClick={() =>
              setShowBlockOptionsDropDown(!showBlockOptionsDropDown)
            }
            aria-label="Formatting Options"
          >
            <span className={"icon block-type text-zinc-400 mr-2"}>
              <img src={ICON_PATHS[blockType]} alt={blockTypeToBlockName[blockType]} className="w-5 h-5" style={iconStyles} />
            </span>
            <span className="text-zinc-300 text-sm">{blockTypeToBlockName[blockType]}</span>
            <i className="ri ri-arrow-down-s-line ml-1"></i>
          </button>
          {showBlockOptionsDropDown &&
            createPortal(
              <BlockOptionsDropdownList
                editor={editor}
                blockType={blockType}
                toolbarRef={toolbarRef}
                setShowBlockOptionsDropDown={setShowBlockOptionsDropDown}
              />,
              document.body
            )}
          <Divider />
        </>
      )}
      {blockType === "code" ? (
        <>
          <Select
            className="toolbar-item code-language bg-zinc-700 text-zinc-300 rounded p-1 text-sm"
            onChange={onCodeLanguageSelect}
            options={codeLanguges}
            value={codeLanguage}
          />
          <i className="chevron-down inside" />
        </>
      ) : (
        <>
          <button
            onClick={decreaseTextSize}
            className="toolbar-item p-2 rounded hover:bg-zinc-700 text-zinc-400"
            aria-label="Decrease Text Size"
          >
            <i className="ri ri-subtract-line text-xl font-bold">-</i>
          </button>
          <input
            type="number"
            value={fontSizeChange}
            onChange={(e) => setFontSizeChange(parseInt(e.target.value, 10))}
            className="w-12 p-1 bg-zinc-700 text-zinc-300 rounded text-center"
            min="1"
            max="72"
          />
          <button
            onClick={increaseTextSize}
            className="toolbar-item p-2 rounded hover:bg-zinc-700 text-zinc-400"
            aria-label="Increase Text Size"
          >
            <i className="ri ri-add-line text-xl font-bold">+</i>
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "bold");
            }}
            className={"toolbar-item p-2 rounded hover:bg-zinc-700 " + (isBold ? "" : "text-zinc-400")}
            aria-label="Format Bold"
            >
            <img src={ICON_PATHS.bold} alt="Bold" className="w-5 h-5" style={iconStyles} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "italic");
            }}
            className={"toolbar-item p-2 rounded hover:bg-zinc-700 " + (isItalic ? "" : "text-zinc-400")}
            aria-label="Format Italics"
          >
            <img src={ICON_PATHS.italic} alt="Italic" className="w-5 h-5" style={iconStyles} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "underline");
            }}
            className={"toolbar-item p-2 rounded hover:bg-zinc-700 " + (isUnderline ? "" : "text-zinc-400")}
            aria-label="Format Underline"
          >
            <img src={ICON_PATHS.underline} alt="Underline" className="w-5 h-5" style={iconStyles} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "strikethrough");
            }}
            className={"toolbar-item p-2 rounded hover:bg-zinc-700 " + (isStrikethrough ? "" : "text-zinc-400")}
            aria-label="Format Strikethrough"
            >
            <img src={ICON_PATHS.strikethrough} alt="Strikethrough" className="w-5 h-5" style={iconStyles} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_TEXT_COMMAND, "code");
            }}
            className={"toolbar-item p-2 rounded hover:bg-zinc-700 " + (isCode ? "" : "text-zinc-400")}
            aria-label="Insert Code"
            >
            <img src={ICON_PATHS.code} alt="Code" className="w-5 h-5" style={iconStyles} />
          </button>
          <button
            onClick={insertLink}
            className={"toolbar-item p-2 rounded hover:bg-zinc-700 " + (isLink ? "" : "text-zinc-400")}
            aria-label="Insert Link"
            >
            <img src={ICON_PATHS.link} alt="Link" className="w-5 h-5" style={iconStyles} />
          </button>
          {isLink &&
            createPortal(<FloatingLinkEditor editor={editor} />, document.body)}
          <Divider />
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "left");
            }}
            className="toolbar-item p-2 rounded hover:bg-zinc-700 text-zinc-400"
            aria-label="Left Align"
          >
            <img src={ICON_PATHS.alignLeft} alt="Left Align" className="w-5 h-5" style={iconStyles} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "center");
            }}
            className="toolbar-item p-2 rounded hover:bg-zinc-700 text-zinc-400"
            aria-label="Center Align"
          >
            <img src={ICON_PATHS.alignCenter} alt="Center Align" className="w-5 h-5" style={iconStyles} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "right");
            }}
            className="toolbar-item p-2 rounded hover:bg-zinc-700 text-zinc-400"
            aria-label="Right Align"
          >
            <img src={ICON_PATHS.alignRight} alt="Right Align" className="w-5 h-5" style={iconStyles} />
          </button>
          <button
            onClick={() => {
              editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, "justify");
            }}
            className="toolbar-item p-2 rounded hover:bg-zinc-700 text-zinc-400"
            aria-label="Justify Align"
          >
            <img src={ICON_PATHS.alignJustify} alt="Justify Align" className="w-5 h-5" style={iconStyles} />
          </button>
        </>
      )}
    </div>
            </>
  );
}
