"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { ArrowUpDown, ThumbsUp, TrendingDown, TrendingUp } from "lucide-react"
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"

import { fetchColleges } from './api/fetchColleges';
import { writeCollege } from './api/writeCollege';

 
import { Pagination, PaginationContent, PaginationEllipsis, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious } from "@/components/ui/pagination"

const initialColleges = [
  { id: 1, name: "Indian Institute of Technology, Delhi", votes: 120, rank: 1 },
  { id: 11, name: "Indian Institute of Technology, Bombay", votes: 115, rank: 2 },
  { id: 16, name: "Indian Institute of Technology, Madras", votes: 112, rank: 3 },
  { id: 6, name: "Indian Institute of Science, Bangalore", votes: 110, rank: 4 },
  { id: 21, name: "Indian Institute of Technology, Kanpur", votes: 108, rank: 5 },
  { id: 26, name: "Indian Institute of Technology, Kharagpur", votes: 106, rank: 6 },
  { id: 30, name: "Indian Institute of Technology, Roorkee", votes: 102, rank: 7 },
  { id: 2, name: "University of Delhi", votes: 98, rank: 8 },
  { id: 15, name: "Birla Institute of Technology and Science, Pilani", votes: 95, rank: 9 },
  { id: 7, name: "University of Mumbai", votes: 88, rank: 10 },
  { id: 3, name: "Jawaharlal Nehru University", votes: 85, rank: 11 },
  { id: 12, name: "Savitribai Phule Pune University", votes: 82, rank: 12 },
  { id: 17, name: "Calcutta University", votes: 78, rank: 13 },
  { id: 4, name: "Banaras Hindu University", votes: 76, rank: 14 },
  { id: 22, name: "Osmania University", votes: 75, rank: 15 },
  { id: 18, name: "Vellore Institute of Technology", votes: 73, rank: 16 },
  { id: 8, name: "Indian Statistical Institute, Kolkata", votes: 72, rank: 17 },
  { id: 27, name: "Jamia Hamdard", votes: 71, rank: 18 },
  { id: 13, name: "Jamia Millia Islamia", votes: 70, rank: 19 },
  { id: 23, name: "National Institute of Technology, Tiruchirappalli", votes: 69, rank: 20 },
  { id: 9, name: "Jadavpur University", votes: 68, rank: 21 },
  { id: 19, name: "Amrita Vishwa Vidyapeetham", votes: 67, rank: 22 },
  { id: 28, name: "Shiv Nadar University", votes: 66, rank: 23 },
  { id: 14, name: "Manipal Academy of Higher Education", votes: 65, rank: 24 },
  { id: 24, name: "Symbiosis International University", votes: 64, rank: 25 },
  { id: 29, name: "Banaras Hindu University Institute of Medical Sciences", votes: 63, rank: 26 },
  { id: 5, name: "Anna University", votes: 62, rank: 27 },
  { id: 20, name: "Tata Institute of Social Sciences", votes: 61, rank: 28 },
  { id: 10, name: "Aligarh Muslim University", votes: 59, rank: 29 },
  { id: 25, name: "Panjab University", votes: 58, rank: 30 },
];

export default function EnhancedCollegeVotingApp() {
  interface College {
    id: number;
    name: string;
    votes: number;
    rank: number;
  }

  const [colleges, setColleges] = useState<College[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [sortOrder, setSortOrder] = useState("desc")
  const [currentPage, setCurrentPage] = useState(1)
  const collegesPerPage = 10
  const { toast } = useToast();

  useEffect(() => {
    const getColleges = async () => {
      const data = await fetchColleges();
      setColleges(data);
    };

    getColleges();
  }, []);



  useEffect(() => {
    const storedColleges = localStorage.getItem('colleges')
    if (storedColleges) {
      setColleges(JSON.parse(storedColleges))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('colleges', JSON.stringify(colleges))
  }, [colleges])

  // const sortedColleges = [...colleges].sort((a, b) => 
  //   sortOrder === "desc" ? b.votes - a.votes : a.votes - b.votes
  // )

  // const rankedColleges = sortedColleges.map((college, index) => ({
  //   ...college,
  //   rank: index + 1
  // }))

  // a function to reverse the order of the colleges


  const reverseColleges = (colleges: any) => {
    return [...colleges].reverse()
  }

  const handleSort = () => {
    setSortOrder(prevOrder => prevOrder === "asc" ? "desc" : "asc")
  }

  const filteredColleges = (sortOrder === "desc" ? colleges : reverseColleges(colleges)).filter((college) =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const indexOfLastCollege = currentPage * collegesPerPage
  const indexOfFirstCollege = indexOfLastCollege - collegesPerPage
  const currentColleges = filteredColleges.slice(indexOfFirstCollege, indexOfLastCollege)



  const handleVote = async (collegeId: number) => {
    const lastVoteTime = localStorage.getItem(`lastVoteTime_`)
    const now = Date.now()

    const college = colleges.find(college => college.id === collegeId);
    if (!college) {
      toast({
        title: "Error",
        description: "College not found.",
        duration: 3000,
      });
      return;
    }
    const newVotes = college.votes + 1;
    const updatedCollege = { ...college, votes: newVotes };

    
    if (!lastVoteTime || now - parseInt(lastVoteTime) >= 300000) {
      setColleges(prevColleges =>
        prevColleges.map(college =>
          college.id === collegeId ? { ...college, votes: college.votes + 1 } : college
        )
      )
      await writeCollege(updatedCollege);
    // setColleges(colleges.map(college => 
    //   college.id === collegeId ? updatedCollege : college
    // ));

    console.log("Voted for college", collegeId  ," at ", new Date().toLocaleTimeString())



      localStorage.setItem(`lastVoteTime_`, now.toString())
      toast({
        title: "Vote Recorded",
        description: "You can vote for this college again in 5 minutes.",
        duration: 30000,
      })
    } else {
      const remainingTime = Math.ceil((300000 - (now - parseInt(lastVoteTime))) / 1000)
      toast({
        title: "Cooldown Active",
        description: `You can vote for this college again in ${remainingTime} seconds.`,
        duration: 30000,
      })
    }
  }

  const canVote = (collegeId: number) => {
    const lastVoteTime = localStorage.getItem(`lastVoteTime_`)
    return !lastVoteTime || Date.now() - parseInt(lastVoteTime) >= 300000
  }



  useEffect(() => {
    const interval = setInterval(() => {
      setColleges(prevColleges => [...prevColleges]);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-yellow-300 p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-5xl font-black text-center mb-8 text-blue-900 transform ">
          Indian College Voter
        </h1>
        <div className="mb-8 flex gap-4">
          <Input
            type="text"
            placeholder="Search for a college..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-grow border-4 border-blue-900 rounded-none shadow-[4px_4px_0_0_#1e3a8a] 
                       bg-white text-blue-900 placeholder-blue-400 font-bold py-2 px-4"
          />
          <Button
            onClick={handleSort}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 
                       border-4 border-blue-900 rounded-none shadow-[4px_4px_0_0_#1e3a8a] 
                       transform transition-all hover:translate-x-1 hover:translate-y-1 
                       hover:shadow-[2px_2px_0_0_#1e3a8a]"
          >
            Sort
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        </div>
        <div className="border-4 border-blue-900 bg-white shadow-[8px_8px_0_0_#1e3a8a]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[80px]">Rank</TableHead>
                <TableHead>College Name</TableHead>
                <TableHead className="text-right">Votes</TableHead>
                <TableHead className="w-[100px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentColleges.map((college) => (
                <TableRow key={college.id} className="hover:bg-blue-100 transition-colors">
                  <TableCell>
                    <div className="flex items-center">
                      <span className="mr-2">{college.rank}</span>
                      {college.rank < college.id && <TrendingUp className="text-green-500 w-4 h-4" />}
                      {college.rank > college.id && <TrendingDown className="text-red-500 w-4 h-4" />}
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{college.name}</TableCell>
                  <TableCell className="text-right">{college.votes}</TableCell>
                  <TableCell>
                    <Button
                      onClick={() => handleVote(college.id)}
                      disabled={!canVote(college.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-1 px-2 
                                 border-2 border-blue-900 rounded-none shadow-[2px_2px_0_0_#1e3a8a] 
                                 transform transition-all hover:translate-x-0.5 hover:translate-y-0.5 
                                 hover:shadow-[1px_1px_0_0_#1e3a8a] disabled:opacity-50 
                                 disabled:cursor-not-allowed"
                    >
                      <ThumbsUp className="h-4 w-4 mr-1" />
                      Vote
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              {Array.from({ length: Math.ceil(filteredColleges.length / collegesPerPage) }, (_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    onClick={() => setCurrentPage(i + 1)}
                    isActive={currentPage === i + 1}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              <PaginationItem>
                <PaginationNext 
                  onClick={() => setCurrentPage(prev => Math.min(Math.ceil(filteredColleges.length / collegesPerPage), prev + 1))}
                  className={currentPage === Math.ceil(filteredColleges.length / collegesPerPage) ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
      <Toaster />
    </div>
  )
}




