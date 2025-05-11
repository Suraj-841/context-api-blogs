import React, { useContext, useEffect, useState } from 'react'
import { useNavigate, useNavigation } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import { baseUrl } from '../baseUrl';
import Header from '../components/Header';
import BlogDetails from '../components/BlogDetails';

const BlogPage = () => {
  
    const [blog,setBlog]=useState(null);
    const [relatedBlogs,setRelatedBlogs]=useState([]);
    const location=useLocation();
    const navigation=useNavigate();
    const {setLoading,loading}=useContext(AppContext);
    const blogId=location.pathname.split("/").at(-1);
    const newBaseUrl="https://codehelp-apis.vercel.app/api"
    
    async function fetchRelatedBlogs(){
        setLoading(true);
        let url=`${newBaseUrl}/get-blog?blogId=${blogId}`;
        try{
            const res=await fetch(url);
            const data=await res.json();
            setBlog(data.blog);
            setRelatedBlogs(data.relatedBlogs);
        }
        catch(e){
            console.log("Error 404 - Invalid Request ")
            setBlog(null);
            setRelatedBlogs([]);
        }
        setLoading(false);
    }
    useEffect(()=>{
        if(blogId){
            fetchRelatedBlogs();
        }
    },[location.pathname])

    return (
    <div>
        <Header/>
        <div>
            <button onClick={()=>navigation(-1)}>
                Back
            </button>
            {
                loading ? (
                <div>
                    <p>Loading</p>
                </div>
                ) : (
                    blog ? (
                        <div>
                            <BlogDetails post={blog}/>
                            <h2>Related Blogs</h2>
                            {
                                relatedBlogs.map((post)=>(
                                    <div key={post.id}>
                                        <BlogDetails post={post}/>
                                    </div>
                                ))
                            }
                        </div>
                    )  : (<div>
                        <p>No blogs found</p>
                    </div>)
                )
            }
        </div> 
    </div>
  )
}

export default BlogPage