import { useState, useEffect } from "react";
import axios from "axios"

function App() {

  // useStates
  const [notes, setNotes] = useState(null)
  const [createForm, setCreateForm] = useState({
    title: "",
    author: ""
  })
  const [updateForm, setUpdateForm] = useState({
    _id: null,
    title: "",
    author: ""
  });

  // useEffects
  useEffect(() => {
    fetchNotes();
  }, [])

  // Functions
  const fetchNotes = async() => {
    const res = await axios.get("http://localhost:3001/notes")

    setNotes(res.data.notes)
  };

  const handleCreateFormField = (e) => {

    const {name, value} = e.target

    setCreateForm({
      ...createForm,
      [name]: value
    })
  }

  const createNote = async(e) => {
    e.preventDefault()        // to prevent reloading when sybmit is clicked.

    const res = await axios.post("http://localhost:3001/notes", createForm)
    
    setNotes([...notes, res.data.note])

    setCreateForm({title: '', author: ''})
  }

  const deleteNote = async(_id) => {
    await axios.delete(`http://localhost:3001/notes/${_id}`)
    
    const newUpdatedNote = [...notes].filter((note) => {
      return note._id !== _id;
    })

    setNotes(newUpdatedNote)
  }

  const handleUpdateFrom = (e) => {
    const {name, value} = e.target
    setUpdateForm({...updateForm, [name]: value})
  }

  const toggleUpdate = (note) => {
    setUpdateForm({_id: note._id, title: note.title, author: note.author})
  }

  const updatedForm = async(e) => {
    e.preventDefault()


    const {title, author} = updateForm
    const res = await axios.put(`http://localhost:3001/notes/${updateForm._id}`, {title, author})

    const noteIndex = notes.findIndex(note => note._id === updateForm._id)

    const newNotes = [...notes]
    newNotes[noteIndex] = res.data.updatedNote
    setNotes(newNotes)

    setUpdateForm({_id: null, title: "", author: ""})
  }

  // View
  return (
    <div className="App">
      {/* Note List */}
      <div>
        <h2>Your Notes:</h2>
        {
          notes && notes.map((note) => {
              return(
                <div key={note._id} >        {/* giving it key bcz each child should have a unique "key" prop. */}
                  <h3>{note.title}</h3>
                  <button onClick={() => deleteNote(note._id)}>Delete</button>
                  <button onClick={() => toggleUpdate(note)}>Update</button>
                </div>
              )
            })
        }
      </div>

      {/* Update Note */}

      { updateForm._id && (
        <div>
          <h2>Update Note</h2>
          <form action="" onSubmit={updatedForm}>
            <input onChange={handleUpdateFrom} name="title" value={updateForm.title} />
            <input onChange={handleUpdateFrom} name="author" value={updateForm.author} />
            <button type="submit">UPDATE</button>
          </form>
        </div>
      )}

      {/* Create Note */}
      { !updateForm._id &&
        <div>
          <h2>Create a Note:</h2>
          <form action="" onSubmit={createNote}>
            <input onChange={handleCreateFormField} value={createForm.title} name="title" placeholder="title" />
            <input onChange={handleCreateFormField} value={createForm.author} name="author" placeholder="author" />
            <button type="submit">Create</button>
          </form>
        </div>
      }
    </div>
  );
}

export default App;
