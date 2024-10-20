'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Book, Users, CloudMoon, Sparkles, Wand2, Loader2, X, Plus } from 'lucide-react'

// Define the StoryFragment interface
interface StoryFragment {
  id: number;
  description: string;
}

// Define the Character interface
interface Character {
  id: number;
  name: string;
  description: string;
  image: string;
}

export function JilpaAiDreamweaver() {
  const [worlds, setWorlds] = useState<{ id: number; title: string; description: string; image: string }[]>([])
  const [characters, setCharacters] = useState<Character[]>([]) // Specify the type of characters
  const [storyFragments, setStoryFragments] = useState<StoryFragment[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [isLoadingWorld, setIsLoadingWorld] = useState(false)
  const [isLoadingCharacter, setIsLoadingCharacter] = useState(false)
  const [worldInput, setWorldInput] = useState('')
  const [characterInput, setCharacterInput] = useState('')

  const generateWorld = async () => {
    setIsLoadingWorld(true);
    try {
      const response = await fetch('http://localhost:8000/api/generate/world', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: worldInput }),
      });
      const newWorld: { id: number; title: string; description: string; image: string } = await response.json();
      setWorlds([...worlds, newWorld]);
      setWorldInput('');
    } catch (error) {
      console.error('Error generating world:', error);
    } finally {
      setIsLoadingWorld(false);
    }
  };

  const deleteWorld = (id: number) => { // Specify the type of id
    setWorlds(worlds.filter(world => world.id !== id))
  }

  const generateCharacter = async () => {
    setIsLoadingCharacter(true);
    try {
      const response = await fetch('http://localhost:8000/api/generate/character', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ input: characterInput }),
      });
      const newCharacter: Character = await response.json(); // Specify the type of newCharacter
      setCharacters([...characters, newCharacter]);
      setCharacterInput('');
    } catch (error) {
      console.error('Error generating character:', error);
    } finally {
      setIsLoadingCharacter(false);
    }
  };

  const deleteCharacter = (id: number) => { // Specify the type of id
    setCharacters(characters.filter(char => char.id !== id))
  }

  const addStoryFragment = () => {
    setStoryFragments([...storyFragments, { id: Date.now(), description: '' }])
  }

  const updateStoryFragment = (id: number, description: string) => {
    setStoryFragments(storyFragments.map(fragment =>
      fragment.id === id ? { ...fragment, description } : fragment
    ));
  }

  const deleteStoryFragment = (id: number) => {
    setStoryFragments(storyFragments.filter(fragment => fragment.id !== id))
  }

  const startHallucination = async () => {
    setIsGenerating(true);
    try {
      const response = await fetch('http://localhost:8000/api/start-hallucination', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      await response.json(); // Handle response if needed
    } catch (error) {
      console.error('Error starting hallucination:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-800 to-blue-900 text-white p-4 lg:p-8">
      <header className="mb-8 text-center">
        <h1 className="text-5xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-300 to-blue-300">JilpaAI: Dreamweaver</h1>
        <p className="text-lg text-blue-200">Unleash your imagination with our hallucination bot</p>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <Tabs defaultValue="worlds" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-indigo-800/50 rounded-lg">
              <TabsTrigger value="worlds" className="data-[state=active]:bg-indigo-600">Worlds</TabsTrigger>
              <TabsTrigger value="characters" className="data-[state=active]:bg-indigo-600">Characters</TabsTrigger>
              <TabsTrigger value="storyFragments" className="data-[state=active]:bg-indigo-600">Story Fragments</TabsTrigger>
            </TabsList>
            <TabsContent value="worlds">
              <Card className="bg-indigo-800/30 border-indigo-600/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-2xl text-blue-200">
                    <div className="flex items-center">
                      <CloudMoon className="mr-2" />
                      Dreamworld Essence
                    </div>
                    <Button
                      onClick={generateWorld}
                      disabled={isLoadingWorld || !worldInput}
                      className="bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      {isLoadingWorld ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Enchant World
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Describe your dreamworld in a few words..."
                    value={worldInput}
                    onChange={(e) => setWorldInput(e.target.value)}
                    className="w-full bg-indigo-700/50 border-indigo-500 focus:border-pink-400 text-blue-100 placeholder-blue-300"
                  />
                  {worlds.map((world) => (
                    <div key={world.id} className="bg-indigo-700/30 border border-indigo-600/50 rounded-lg p-4 relative">
                      <Button
                        onClick={() => deleteWorld(world.id)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-pink-300 hover:text-pink-100 hover:bg-pink-500/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <h3 className="text-xl font-semibold text-pink-300 mb-2">{world.title}</h3>
                      <p className="text-blue-200 mb-4">{world.description}</p>
                      <img src={world.image} alt={world.title} className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="characters">
              <Card className="bg-indigo-800/30 border-indigo-600/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-2xl text-blue-200">
                    <div className="flex items-center">
                      <Users className="mr-2" />
                      Dreamworld Inhabitants
                    </div>
                    <Button
                      onClick={generateCharacter}
                      disabled={isLoadingCharacter || !characterInput}
                      className="bg-pink-500 hover:bg-pink-600 text-white"
                    >
                      {isLoadingCharacter ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Wand2 className="mr-2 h-4 w-4" />
                      )}
                      Conjure Character
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    placeholder="Describe your character in a few words..."
                    value={characterInput}
                    onChange={(e) => setCharacterInput(e.target.value)}
                    className="w-full bg-indigo-700/50 border-indigo-500 focus:border-pink-400 text-blue-100 placeholder-blue-300"
                  />
                  {characters.map((character) => (
                    <div key={character.id} className="bg-indigo-700/30 border border-indigo-600/50 rounded-lg p-4 relative">
                      <Button
                        onClick={() => deleteCharacter(character.id)}
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 text-pink-300 hover:text-pink-100 hover:bg-pink-500/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <h3 className="text-xl font-semibold text-pink-300 mb-2">{character.name}</h3>
                      <p className="text-blue-200 mb-4">{character.description}</p>
                      <img src={character.image} alt={character.name} className="w-full h-48 object-cover rounded-lg" />
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="storyFragments">
              <Card className="bg-indigo-800/30 border-indigo-600/50 backdrop-blur-sm">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-2xl text-blue-200">
                    <div className="flex items-center">
                      <Book className="mr-2" />
                      Story Fragments
                    </div>
                    <Button
                      onClick={addStoryFragment}
                      variant="outline"
                      className="text-pink-300 border-pink-500 hover:bg-pink-500/20"
                    >
                      <Plus className="mr-2 h-4 w-4" />
                      Add Fragment
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {storyFragments.map((fragment) => (
                    <div key={fragment.id} className="flex items-center space-x-2">
                      <Input
                        placeholder="Write your story fragment..."
                        value={fragment.description}
                        onChange={(e) => updateStoryFragment(fragment.id, e.target.value)}
                        className="flex-grow bg-indigo-700/50 border-indigo-500 focus:border-pink-400 text-blue-100 placeholder-blue-300"
                      />
                      <Button
                        onClick={() => deleteStoryFragment(fragment.id)}
                        variant="ghost"
                        size="sm"
                        className="text-pink-300 hover:text-pink-100 hover:bg-pink-500/20"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
          <Button
            onClick={startHallucination}
            disabled={isGenerating}
            className="w-full bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 text-white font-bold py-3 rounded-lg transition-all duration-300 flex items-center justify-center"
          >
            {isGenerating ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Weaving Dreams...
              </>
            ) : (
              <>
                Start Hallucination
                <Sparkles className="ml-2" />
              </>
            )}
          </Button>
        </div>
        <div className="space-y-6">
          <Card className="bg-indigo-800/30 border-indigo-600/50 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-200">Dream Tapestry</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="aspect-video bg-indigo-900/50 rounded-lg flex items-center justify-center mb-4">
                {isGenerating ? (
                  <div className="text-2xl font-bold animate-pulse text-pink-300">Weaving Dreams...</div>
                ) : (
                  <div className="text-xl text-blue-300">Your story will manifest here</div>
                )}
              </div>
              <p className="text-blue-200">Watch as JilpaAI weaves your dreamworld into reality</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
