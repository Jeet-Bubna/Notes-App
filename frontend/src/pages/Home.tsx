import React, { useEffect, useState } from "react"
import api from "../api"
import Note from "../components/Note"

interface NoteType {
    id: number;
    title: string;
    content: string;
    created_at: string;
}



function Home() {
    
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [notes, setNote] = useState<NoteType[]>([])

    useEffect(() => {
        getNotes();
    }, []);

    const getNotes = () => {
       api.get("/api/notes/")
       .then((res) => {
        setNote(res.data)
        console.log(res.data)
       })
       .catch((error) => alert(error))
    }

    const deleteNotes = (id:number) => {
        api.delete(`api/notes/delete/${id}/`)
        .then((res) => {
            if(res.status === 204) alert("Note deleted succesfully")
            else alert("failed to delete notes")
            getNotes()
        })
    }

    const createNote = (e:React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
       api.post("/api/notes/", {title, content})
       .then((res) => {
        if(res.status === 201) alert("Note created.")
        else alert("Couldnt create a note")
        getNotes()
       })
       .catch((error) => alert(error))
    }

    return <div>
        <div>
            <h1>Notes</h1>
            {notes.map((note) => <Note note={note} onDelete={deleteNotes} key={note.id}/>)}
            
        </div>
        <div>
            <h1>Make a Note</h1>
            <form onSubmit={createNote} className="home-form">
                <label>Title</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>Content</label>
                <textarea value={content} onChange={(e) => setContent(e.target.value)} />
                
                <input type="submit" value="Submit" />
            </form>
        </div>
    </div>
}

export default Home