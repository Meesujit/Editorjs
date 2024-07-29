'use client'
import React from 'react';
import EditorContextProvider from '@/components/EditorContextProvider';

const Home = () => {
  

  return (
    <div className="flex flex-col justify-center text-center">
      <h1 className='text-3xl mt-4 mb-10 '>Document Maker</h1>
      <div className="flex flex-row justify-center text-center gap-2 mx-2">
        <div className="w-1/2 h-1/2 border bg-slate-100">
          <EditorContextProvider  children={undefined} />         
        </div>        
      </div>
    </div>
  );
};

export default Home;
