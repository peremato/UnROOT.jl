var documenterSearchIndex = {"docs":
[{"location":"quickstart/#Quick-Start","page":"Quick Start","title":"Quick Start","text":"","category":"section"},{"location":"quickstart/","page":"Quick Start","title":"Quick Start","text":"Modules = [UnROOT]\nFilter   = t -> contains(string(t), \"Lazy\")","category":"page"},{"location":"quickstart/#UnROOT.LazyBranch","page":"Quick Start","title":"UnROOT.LazyBranch","text":"LazyBranch(f::ROOTFile, branch)\n\nConstruct an accessor for a given branch such that BA[idx] and or BA[1:20] is type-stable. And memory footprint is a single basket (<1MB usually). You can also iterate or map over it. If you want a concrete Vector, simply collect() the LazyBranch.\n\nExample\n\njulia> rf = ROOTFile(\"./test/samples/tree_with_large_array.root\");\n\njulia> b = rf[\"t1/int32_array\"];\n\njulia> ab = UnROOT.LazyBranch(rf, b);\n\njulia> for entry in ab\n           @show entry\n           break\n       end\nentry = 0\n\njulia> ab[begin:end]\n0\n1\n...\n\n\n\n\n\n","category":"type"},{"location":"quickstart/#UnROOT.LazyTree-Tuple{ROOTFile, AbstractString, Any}","page":"Quick Start","title":"UnROOT.LazyTree","text":"LazyTree(f::ROOTFile, s::AbstractString, branche::Union{AbstractString, Regex})\nLazyTree(f::ROOTFile, s::AbstractString, branches::Vector{Union{AbstractString, Regex}})\n\nConstructor for LazyTree, which is close to an AbstractDataFrame (interface wise), and a lazy TypedTables.Table (speed wise). Looping over a LazyTree is fast and type stable. Internally, LazyTree contains a typed table whose branch are LazyBranch. This means that at any given time only N baskets are cached, where N is the number of branches.\n\nnote: Note\nAccessing with [start:stop] will return a LazyTree with concrete internal table.\n\nExample\n\njulia> mytree = LazyTree(f, \"Events\", [\"Electron_dxy\", \"nMuon\", r\"Muon_(pt|eta)$\"])\n Row │ Electron_dxy     nMuon   Muon_eta         Muon_pt\n     │ Vector{Float32}  UInt32  Vector{Float32}  Vector{Float32}\n─────┼───────────────────────────────────────────────────────────\n 1   │ [0.000371]       0       []               []\n 2   │ [-0.00982]       2       [0.53, 0.229]    [19.9, 15.3]\n 3   │ []               0       []               []\n 4   │ [-0.00157]       0       []               []\n ⋮   │     ⋮            ⋮             ⋮                ⋮\n\n\n\n\n\n","category":"method"},{"location":"#UnROOT.jl","page":"Introduction","title":"UnROOT.jl","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"<!– ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section –> (Image: All Contributors) <!– ALL-CONTRIBUTORS-BADGE:END –>","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"(Image: Dev) (Image: Build Status) (Image: Codecov)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"UnROOT.jl is a (WIP) reader for the CERN ROOT file format written entirely in pure Julia, without no dependence on ROOT or Python.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"While the ROOT documentation does not contain a detailed description of the binary structure, the format can be triangulated by other packages like","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"uproot3 (Python), see also UpROOT.jl\ngroot (Go)\nroot-io (Rust)\nLaurelin (Java)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Here's a detailed from-scratch walk through  on reading a jagged branch from .root file, recommdned for first time contributors or just want to learn about .root file format.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Three's also a discussion reagarding the ROOT binary format documentation on uproot's issue page.","category":"page"},{"location":"#Status","page":"Introduction","title":"Status","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"We support reading all scalar branch and jagged branch of \"basic\" types, provide indexing and iteration interface with per branch basket-cache. As a metric, UnROOT can read all branches (~1800) of CMS NanoAOD including jagged TLorentzVector branch.","category":"page"},{"location":"#Quick-Start","page":"Introduction","title":"Quick Start","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"The most easy way to access data is through LazyTree, which is <: AbstractDataFrame and a thin-wrap around TypedTable under the hood. It supports most accessing pattern from the loved DataFrames eco-system.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> using UnROOT\n\njulia> f = ROOTFile(\"test/samples/NanoAODv5_sample.root\")\nROOTFile with 2 entries and 21 streamers.\ntest/samples/NanoAODv5_sample.root\n└─ Events\n   ├─ \"run\"\n   ├─ \"luminosityBlock\"\n   ├─ \"event\"\n   ├─ \"HTXS_Higgs_pt\"\n   ├─ \"HTXS_Higgs_y\"\n   └─ \"⋮\"\n\njulia> mytree = LazyTree(f, \"Events\", [\"Electron_dxy\", \"nMuon\", r\"Muon_(pt|eta)$\"])\n Row │ Electron_dxy     nMuon   Muon_eta         Muon_pt\n     │ Vector{Float32}  UInt32  Vector{Float32}  Vector{Float32}\n─────┼───────────────────────────────────────────────────────────\n 1   │ [0.000371]       0       []               []\n 2   │ [-0.00982]       2       [0.53, 0.229]    [19.9, 15.3]\n 3   │ []               0       []               []\n 4   │ [-0.00157]       0       []               []\n ⋮   │     ⋮            ⋮             ⋮                ⋮\n \n \njulia> mytree[1:3, :nMuon]\n3-element Vector{UInt32}:\n 0x00000000\n 0x00000002\n 0x00000000","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"You can iterate through a LazyTree:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> for event in mytree\n           @show event.Electron_dxy\n           break\n       end\nevent.Electron_dxy = Float32[0.00037050247]","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Only one basket per branch will be cached so you don't have to worry about running out or RAM. At the same time, event inside the for-loop is not materialized until a field is accessed. If your event is fairly small or you need all of them anyway, you can collect(event) first inside the loop.","category":"page"},{"location":"#Branch-of-custom-struct","page":"Introduction","title":"Branch of custom struct","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"We provide an experimental interface for hooking up UnROOT with your custom types that only takes 2 steps, as explained here. As a show case for this functionality, the TLorentzVector support in UnROOT is implemented with the said plug-in system.","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"Alternatively, reading raw data is also possible using the UnROOT.array(f::ROOTFile, path; raw=true) method. The output can be then reinterpreted using a custom type with the method UnROOT.splitup(data, offsets, T::Type; skipbytes=0). This provides more fine grain control in case your branch is highly irregular. You can then define suitable Julia type and readtype method for parsing these data. Here is it in action, with the help of the types from custom.jl, and some data from the KM3NeT experiment:","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> using UnROOT\n\njulia> f = ROOTFile(\"test/samples/km3net_online.root\")\nROOTFile(\"test/samples/km3net_online.root\") with 10 entries and 41 streamers.\n\njulia> data, offsets = array(f, \"KM3NET_EVENT/KM3NET_EVENT/snapshotHits\"; raw=true)\n2058-element Array{UInt8,1}:\n 0x00\n 0x03\n   ⋮\n   \njulia> UnROOT.splitup(data, offsets, UnROOT.KM3NETDAQHit)\n4-element Vector{Vector{UnROOT.KM3NETDAQHit}}:\n [UnROOT.KM3NETDAQHit(1073742790, 0x00, 9, 0x60)......","category":"page"},{"location":"#Main-challenges","page":"Introduction","title":"Main challenges","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"ROOT data is generally stored as big endian and is a self-descriptive format, i.e. so-called streamers are stored in the files which describe the actual structure of the data in the corresponding branches. These streamers are read during runtime and need to be used to generate Julia structs and unpack methods on the fly.\nPerformance is very important for a low level I/O library.","category":"page"},{"location":"#Low-hanging-fruits","page":"Introduction","title":"Low hanging fruits","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Pick one ;)","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"[x] Parsing the file header\n[x] Read the TKeys of the top level dictionary\n[x] Reading the available trees\n[x] Reading the available streamers\n[x] Reading a simple dataset with primitive streamers\n[x] Reading of raw basket bytes for debugging\n[ ] Automatically generate streamer logic\n[x] Prettier show for Lazy*s\n[ ] Clean up Cursor use\n[x] Reading TNtuple #27\n[x] Reading histograms (TH1D, TH1F, TH2D, TH2F, etc.) #48\n[ ] Clean up the readtype, unpack, stream! and readobjany construct\n[ ] Refactor the code and add more docs\n[ ] Class name detection of sub-branches\n[ ] High-level histogram interface","category":"page"},{"location":"#Acknowledgements","page":"Introduction","title":"Acknowledgements","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Special thanks to Jim Pivarski (@jpivarski) from the Scikit-HEP project, who is the main author of uproot, a native Python library to read and write ROOT files, which was and is a great source of inspiration and information for reverse engineering the ROOT binary structures.","category":"page"},{"location":"#Behind-the-scene","page":"Introduction","title":"Behind the scene","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"<details><summary>Some additional debug output: </summary> <p>","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"julia> using UnROOT\n\njulia> f = ROOTFile(\"test/samples/tree_with_histos.root\")\nCompressed stream at 1509\nROOTFile(\"test/samples/tree_with_histos.root\") with 1 entry and 4 streamers.\n\njulia> keys(f)\n1-element Array{String,1}:\n \"t1\"\n\njulia> keys(f[\"t1\"])\nCompressed datastream of 1317 bytes at 1509 (TKey 't1' (TTree))\n2-element Array{String,1}:\n \"mynum\"\n \"myval\"\n\njulia> f[\"t1\"][\"mynum\"]\nCompressed datastream of 1317 bytes at 6180 (TKey 't1' (TTree))\nUnROOT.TBranch\n  cursor: UnROOT.Cursor\n  fName: String \"mynum\"\n  fTitle: String \"mynum/I\"\n  fFillColor: Int16 0\n  fFillStyle: Int16 1001\n  fCompress: Int32 101\n  fBasketSize: Int32 32000\n  fEntryOffsetLen: Int32 0\n  fWriteBasket: Int32 1\n  fEntryNumber: Int64 25\n  fIOFeatures: UnROOT.ROOT_3a3a_TIOFeatures\n  fOffset: Int32 0\n  fMaxBaskets: UInt32 0x0000000a\n  fSplitLevel: Int32 0\n  fEntries: Int64 25\n  fFirstEntry: Int64 0\n  fTotBytes: Int64 170\n  fZipBytes: Int64 116\n  fBranches: UnROOT.TObjArray\n  fLeaves: UnROOT.TObjArray\n  fBaskets: UnROOT.TObjArray\n  fBasketBytes: Array{Int32}((10,)) Int32[116, 0, 0, 0, 0, 0, 0, 0, 0, 0]\n  fBasketEntry: Array{Int64}((10,)) [0, 25, 0, 0, 0, 0, 0, 0, 0, 0]\n  fBasketSeek: Array{Int64}((10,)) [238, 0, 0, 0, 0, 0, 0, 0, 0, 0]\n  fFileName: String \"\"\n\n\njulia> seek(f.fobj, 238)\nIOStream(<file test/samples/tree_with_histos.root>)\n\njulia> basketkey = UnROOT.unpack(f.fobj, UnROOT.TKey)\nUnROOT.TKey64(116, 1004, 100, 0x6526eafb, 70, 0, 238, 100, \"TBasket\", \"mynum\", \"t1\")\n\njulia> s = UnROOT.datastream(f.fobj, basketkey)\nCompressed datastream of 100 bytes at 289 (TKey 'mynum' (TBasket))\nIOBuffer(data=UInt8[...], readable=true, writable=false, seekable=true, append=false, size=100, maxsize=Inf, ptr=1, mark=-1)\n\njulia> [UnROOT.readtype(s, Int32) for _ in 1:f[\"t1\"][\"mynum\"].fEntries]\nCompressed datastream of 1317 bytes at 6180 (TKey 't1' (TTree))\n25-element Array{Int32,1}:\n  0\n  1\n  2\n  3\n  4\n  5\n  6\n  7\n  8\n  9\n 10\n 10\n 10\n 10\n 10","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"</p> </details>","category":"page"},{"location":"#Contributors","page":"Introduction","title":"Contributors ✨","text":"","category":"section"},{"location":"","page":"Introduction","title":"Introduction","text":"Thanks goes to these wonderful people (emoji key):","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"<!– ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section –> <!– prettier-ignore-start –> <!– markdownlint-disable –> <table>   <tr>     <td align=\"center\"><a href=\"http://www.tamasgal.com\"><img src=\"https://avatars.githubusercontent.com/u/1730350?v=4?s=100\" width=\"100px;\" alt=\"\"/><br /><sub><b>Tamas Gal</b></sub></a><br /><a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=tamasgal\" title=\"Code\">💻</a> <a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=tamasgal\" title=\"Documentation\">📖</a> <a href=\"#infra-tamasgal\" title=\"Infrastructure (Hosting, Build-Tools, etc)\">🚇</a> <a href=\"#data-tamasgal\" title=\"Data\">🔣</a> <a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=tamasgal\" title=\"Tests\">⚠️</a></td>     <td align=\"center\"><a href=\"https://github.com/Moelf\"><img src=\"https://avatars.githubusercontent.com/u/5306213?v=4?s=100\" width=\"100px;\" alt=\"\"/><br /><sub><b>Jerry Ling</b></sub></a><br /><a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=Moelf\" title=\"Code\">💻</a> <a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=Moelf\" title=\"Tests\">⚠️</a> <a href=\"#data-Moelf\" title=\"Data\">🔣</a> <a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=Moelf\" title=\"Documentation\">📖</a></td>     <td align=\"center\"><a href=\"https://github.com/8me\"><img src=\"https://avatars.githubusercontent.com/u/17862090?v=4?s=100\" width=\"100px;\" alt=\"\"/><br /><sub><b>Johannes Schumann</b></sub></a><br /><a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=8me\" title=\"Code\">💻</a> <a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=8me\" title=\"Tests\">⚠️</a> <a href=\"#data-8me\" title=\"Data\">🔣</a></td>     <td align=\"center\"><a href=\"https://github.com/aminnj\"><img src=\"https://avatars.githubusercontent.com/u/5760027?v=4?s=100\" width=\"100px;\" alt=\"\"/><br /><sub><b>Nick Amin</b></sub></a><br /><a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=aminnj\" title=\"Code\">💻</a> <a href=\"https://github.com/tamasgal/UnROOT.jl/commits?author=aminnj\" title=\"Tests\">⚠️</a> <a href=\"#data-aminnj\" title=\"Data\">🔣</a></td>     <td align=\"center\"><a href=\"https://giordano.github.io\"><img src=\"https://avatars.githubusercontent.com/u/765740?v=4?s=100\" width=\"100px;\" alt=\"\"/><br /><sub><b>Mosè Giordano</b></sub></a><br /><a href=\"#infra-giordano\" title=\"Infrastructure (Hosting, Build-Tools, etc)\">🚇</a></td>   </tr> </table>","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"<!– markdownlint-restore –> <!– prettier-ignore-end –>","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"<!– ALL-CONTRIBUTORS-LIST:END –>","category":"page"},{"location":"","page":"Introduction","title":"Introduction","text":"This project follows the all-contributors specification. Contributions of any kind welcome!","category":"page"},{"location":"internals/","page":"Internals","title":"Internals","text":"Modules = [UnROOT]\nFilter   = t -> !(contains(string(t), \"Lazy\"))","category":"page"},{"location":"internals/#UnROOT.Cursor","page":"Internals","title":"UnROOT.Cursor","text":"The Cursor type is embeded into Branches of a TTree such that when we need to read the content of a Branch, we don't need to go through the Directory and find the TKey and then seek to where the Branch is.\n\nnote: Note\nThe io inside a Cursor is in fact only a buffer, it is NOT a io that refers to the whole file's stream.\n\n\n\n\n\n","category":"type"},{"location":"internals/#UnROOT.Preamble-Union{Tuple{T}, Tuple{Any, Type{T}}} where T","page":"Internals","title":"UnROOT.Preamble","text":"Reads the preamble of an object.\n\nThe cursor will be put into the right place depending on the data.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.ROOTFile-Tuple{AbstractString}","page":"Internals","title":"UnROOT.ROOTFile","text":"ROOTFile(filename::AbstractString; customstructs = Dict(\"TLorentzVector\" => LorentzVector{Float64}))\n\nROOTFile's constructor from a file. The customstructs dictionary can be used to pass user-defined struct as value and its corresponding fClassName (in Branch) as key such that UnROOT will know to intepret them, see interped_data.\n\nSee also: LazyTree, LazyBranch\n\nExample\n\njulia> f = ROOTFile(\"test/samples/NanoAODv5_sample.root\")\nROOTFile with 2 entries and 21 streamers.\ntest/samples/NanoAODv5_sample.root\n└─ Events\n   ├─ \"run\"\n   ├─ \"luminosityBlock\"\n   ├─ \"event\"\n   ├─ \"HTXS_Higgs_pt\"\n   ├─ \"HTXS_Higgs_y\"\n   └─ \"⋮\"\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.Streamers-Tuple{Any}","page":"Internals","title":"UnROOT.Streamers","text":"function Streamers(io)\n\nReads all the streamers from the ROOT source.\n\n\n\n\n\n","category":"method"},{"location":"internals/#Base.getindex-Union{Tuple{J}, Tuple{T}, Tuple{LazyBranch{T, J}, Integer}} where {T, J}","page":"Internals","title":"Base.getindex","text":"Base.getindex(ba::LazyBranch{T, J}, idx::Integer) where {T, J}\n\nGet the idx-th element of a LazyBranch, starting at 1. If idx is within the range of ba.buffer_range, it will directly return from ba.buffer. If not within buffer, it will fetch the correct basket by calling basketarray and update buffer and buffer range accordingly.\n\nwarning: Warning\nBecause currently we only cache a single basket inside LazyBranch at any given moment, access a LazyBranch from different threads at the same time can cause performance issue and incorrect event result.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.array-Tuple{ROOTFile, AbstractString}","page":"Internals","title":"UnROOT.array","text":"array(f::ROOTFile, path; raw=false)\n\nReads an array from a branch. Set raw=true to return raw data and correct offsets.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.arrays-Tuple{ROOTFile, Any}","page":"Internals","title":"UnROOT.arrays","text":"arrays(f::ROOTFile, treename)\n\nReads all branches from a tree.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.auto_T_JaggT-Tuple{Any}","page":"Internals","title":"UnROOT.auto_T_JaggT","text":"auto_T_JaggT(branch; customstructs::Dict{String, Type})\n\nGiven a branch, automatically return (eltype, Jaggtype). This function is aware of custom structs that are carried with the parent ROOTFile.\n\nThis is also where you may want to \"redirect\" classname -> Julia struct name, for example \"TLorentzVector\" => LorentzVector here and you can focus on LorentzVectors.LorentzVector methods from here on.\n\nSee also: ROOTFile, interped_data\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.basketarray-Tuple{ROOTFile, AbstractString, Any}","page":"Internals","title":"UnROOT.basketarray","text":"basketarray(f::ROOTFile, path::AbstractString, ith)\nbasketarray(f::ROOTFile, branch::Union{TBranch, TBranchElement}, ith)\n\nReads actual data from ith basket of a branch. This function first calls readbasket to obtain raw bytes and offsets of a basket, then calls auto_T_JaggT followed  by interped_data to translate raw bytes into actual data.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.compressed_datastream-Tuple{Any, Any}","page":"Internals","title":"UnROOT.compressed_datastream","text":"compressed_datastream(io, tkey)\n\nExtract all [compressionheader][rawbytes] from a TKey. This is an isolated function because we want to compartmentalize disk I/O as much as possible.\n\nSee also: decompress_datastreambytes\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.decompress_datastreambytes-Tuple{Any, Any}","page":"Internals","title":"UnROOT.decompress_datastreambytes","text":"decompress_datastreambytes(compbytes, tkey)\n\nProcess the compressed bytes compbytes which was read out by compressed_datastream and pointed to from tkey. This function simply return uncompressed bytes according to the compression algorithm detected (or the lack of).\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.endcheck-Union{Tuple{T}, Tuple{Any, T}} where T<:UnROOT.Preamble","page":"Internals","title":"UnROOT.endcheck","text":"function endcheck(io, preamble::Preamble)\n\nChecks if everything went well after parsing a TOBject. Used in conjuction with Preamble.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.interped_data-Tuple{Any, Any, Type{Vector{LorentzVectors.LorentzVector{Float64}}}, Type{UnROOT.Offsetjagg}}","page":"Internals","title":"UnROOT.interped_data","text":"interped_data(rawdata, rawoffsets, ::Type{Vector{LorentzVector{Float64}}}, ::Type{Offsetjagg})\n\nThe interped_data method specialized for LorentzVector. This method will get called by basketarray instead of the default method for TLorentzVector branch.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.interped_data-Union{Tuple{J}, Tuple{T}, Tuple{Any, Any, Type{T}, Type{J}}} where {T, J<:UnROOT.JaggType}","page":"Internals","title":"UnROOT.interped_data","text":"interped_data(rawdata, rawoffsets, ::Type{T}, ::Type{J}) where {T, J<:JaggType}\n\nThe function thats interpret raw bytes (from a basket) into corresponding Julia data, based on type T and jagg type J.\n\nIn order to retrieve data from custom branches, user should defined more speialized method of this function with specific T and J. See TLorentzVector example.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.readbasket-Tuple{ROOTFile, Any, Any}","page":"Internals","title":"UnROOT.readbasket","text":"readbasket(f::ROOTFile, branch, ith)\nreadbasketseek(f::ROOTFile, branch::Union{TBranch, TBranchElement}, seek_pos::Int)\n\nThe fundamental building block of reading read data from a .root file. Read read one basket's raw bytes and offsets at a time. These raw bytes and offsets then (potentially) get processed by interped_data.\n\nSee also: auto_T_JaggT, basketarray\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.readobjany!-Tuple{Any, Union{UnROOT.TKey32, UnROOT.TKey64}, Any}","page":"Internals","title":"UnROOT.readobjany!","text":"function readobjany!(io, tkey::TKey, refs)\n\nThe main entrypoint where streamers are parsed and cached for later use. The refs dictionary holds the streamers or parsed data which are reused when already available.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.skiptobj-Tuple{Any}","page":"Internals","title":"UnROOT.skiptobj","text":"function skiptobj(io)\n\nSkips a TOBject.\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.splitup-Tuple{Vector{UInt8}, Any, Type}","page":"Internals","title":"UnROOT.splitup","text":"splitup(data::Vector{UInt8}, offsets, T::Type; skipbytes=0)\n\nGiven the offsets and data return by array(...; raw = true), reconstructed the actual array (with custome struct, can be jagged as well).\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.topological_sort-Tuple{Any}","page":"Internals","title":"UnROOT.topological_sort","text":"function topological_sort(streamer_infos)\n\nSort the streamers with respect to their dependencies and keep only those which are not defined already.\n\nThe implementation is based on https://stackoverflow.com/a/11564769/1623645\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.unpack-Tuple{UnROOT.CompressionHeader}","page":"Internals","title":"UnROOT.unpack","text":"unpack(x::CompressionHeader)\n\nReturn the following information:\n\nName of compression algorithm\nLevel of the compression\ncompressedbytes and uncompressedbytes according to uproot3\n\n\n\n\n\n","category":"method"},{"location":"internals/#UnROOT.@stack-Tuple{Any, Vararg{Any, N} where N}","page":"Internals","title":"UnROOT.@stack","text":"macro stack(into, structs...)\n\nStack the fields of multiple structs and create a new one. The first argument is the name of the new struct followed by the ones to be stacked. Parametric types are not supported and the fieldnames needs to be unique.\n\nExample:\n\n@stack Baz Foo Bar\n\nCreates Baz with the concatenated fields of Foo and Bar\n\n\n\n\n\n","category":"macro"}]
}
