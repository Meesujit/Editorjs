'use client'
import React, { createContext, useRef, useEffect, ReactNode, useState } from 'react'
import EditorJS from '@editorjs/editorjs'
import Header from '@editorjs/header'
import List from '@editorjs/list'
// import Checklist from '@editorjs/checklist'

// Define the shape of the context value
interface EditorContextType {
  editor: EditorJS | null;
  submitEditorData: () => void;
  editorContent: any;
}

// Create the context with the correct type
export const EditorContext = createContext<EditorContextType | undefined>(undefined);

const EditorContextProvider = ({ children }: { children: ReactNode }) => {
  const editorInstanceRef = useRef<EditorJS | null>(null);
  const [editorContent, setEditorContent] = useState<any>(null);
  
  useEffect(() => {
    // Initialize the EditorJS instance if it hasn't been initialized yet
    if (editorInstanceRef.current === null) {
      editorInstanceRef.current = new EditorJS({
        holder: 'editorjs',
        placeholder: 'Let`s write an awesome story!',        
        tools: {
          header: Header,
          list: List,
          // checklist: Checklist
        },
      });
    }

    // Clean up the EditorJS instance when the component unmounts
    return () => {
      if (editorInstanceRef.current && typeof editorInstanceRef.current.destroy === 'function') {
        editorInstanceRef.current.destroy();
        editorInstanceRef.current = null;
      }
    };
  }, []);

  const submitEditorData = () => {
    if (editorInstanceRef.current) {
      editorInstanceRef.current.save()
        .then((outputData) => {
          console.log('Editor data:', outputData);
          setEditorContent(outputData);
        })
        .catch((error) => {
          console.error('Saving failed:', error);
        });
    }
  };

  return (
    <>
    <EditorContext.Provider value={{ editor: editorInstanceRef.current, submitEditorData, editorContent }}>
      <div id='editorjs' className=''></div>
      {children}
      <button onClick={submitEditorData} className='bg-zinc-700 w-1/4 h-10 mb-6 rounded-xl text-white'>Submit</button>
        {editorContent && (
          <div className="w-full h-1/4">
          <div className="flex flex-col justify-center text-center text-xl">
            <h5 className="text-zinc-800">Editor Data</h5>
            {editorContent.blocks.map((block: any) => {
              if (block.type === 'header') {
                return <h1 className="text-zinc-700 text-2xl" key={block.id}>{block.data.text}</h1>;
              } else if (block.type === 'list') {
                return <ul className="text-zinc-700" key={block.id}>{block.data.items.map((item: string) => <li key={item}>{item}</li>)}</ul>;
              } else if (block.type === 'checklist') {
                return <ul className="text-zinc-700" key={block.id}>{block.data.items.map((item: any) => <li key={item.text}>{item.checked ? <span>&#9745;</span> : <span>&#9744;</span>}{item.id} {item.text}</li>)}</ul>;
              } else {
                return <p className="text-zinc-700" key={block.id}>{block.data.text}</p>;
              }
            })}
        </div>
      </div>
      )}
    </EditorContext.Provider>
  </>
  );
};

export default EditorContextProvider;
