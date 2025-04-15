"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Code, 
  Upload, 
  Play, 
  Send, 
  Terminal, 
  CheckCircle, 
  Zap, 
  FileCode, 
  GitBranch, 
  Layers,
  Copy,
  DownloadCloud,
  ExternalLink,
  FileText,
  Book,
  Info,
  Brain,
  Sparkles,
  Loader2,
  AlertCircle
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { useDropzone } from "react-dropzone"

const AI_MODELS = {
  free: {
    "gpt-3.5-turbo": {
      name: "GPT-3.5 Turbo",
      description: "Fast and efficient for most test generation tasks",
    },
  },
  pro: {
    "gpt-4": {
      name: "GPT-4",
      description: "Most advanced model for complex test scenarios",
    },
    "claude-3-7-sonnet-20250219": {
      name: "Claude 3.7 Sonnet",
      description: "Best for large codebases and complex test cases",
    },
    "claude-3-5-haiku-20241022": {
      name: "Claude 3.5 Haiku",
      description: "Balanced performance for most test generation needs",
    },
  },
}

interface TestDocumentation {
  overview: string;
  testStructure: string;
  coverageDetails: string[];
  frameworkFeatures: string[];
  bestPractices: string[];
  implementationNotes: string[];
}

const EditorPage = () => {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("code");
  const [selectedModel, setSelectedModel] = useState<string>("gpt-3.5-turbo");
  const [selectedFramework, setSelectedFramework] = useState<string>("jest");
  const [code, setCode] = useState<string>("");
  const [testCode, setTestCode] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [userTier, setUserTier] = useState<'free' | 'pro'>('free');
  const [tokenUsage, setTokenUsage] = useState<number>(0);
  const [tokenLimit, setTokenLimit] = useState<number>(5000);
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState<string>("");
  const [analysisProgress, setAnalysisProgress] = useState<number>(0);
  const [testDocumentation, setTestDocumentation] = useState<TestDocumentation | null>(null);
  const [testCount, setTestCount] = useState<number>(0);
  const [coverage, setCoverage] = useState<number>(0);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      router.push('/try');
      return;
    }

    const fetchUserData = async () => {
      try {
        const response = await fetch("/api/user-data");
        if (response.ok) {
          const data = await response.json();
          setUserTier(data.tier);
          setTokenUsage(data.token_usage);
          setTokenLimit(data.token_limit);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    if (isSignedIn) {
      fetchUserData();
    }
  }, [isLoaded, isSignedIn, router]);

  const handleFileUpload = async (acceptedFiles: File[]) => {
    if (userTier === 'free' && acceptedFiles.length > 1) {
      toast.error("Free users can only upload one file at a time. Upgrade to Pro for multiple file uploads.")
      return
    }

    try {
      const formData = new FormData()
      // For pro users, append all files
      if (userTier === 'pro') {
        acceptedFiles.forEach((file) => {
          formData.append("files[]", file)
        })
      } else {
        // For free users, only append the first file
        formData.append("file", acceptedFiles[0])
      }

      const response = await fetch("/api/upload-files", {
        method: "POST",
        body: formData,
      })

      const data = await response.json()
      
      if (!response.ok) {
        throw new Error(data.error || "Failed to upload file")
      }

      // Update the code with the combined content
      setCode(data.code)
      // Show the number of files uploaded for pro users
      if (userTier === 'pro') {
        setUploadedFileName(`${acceptedFiles.length} files uploaded`)
        toast.success(`Successfully uploaded ${acceptedFiles.length} files`)
      } else {
        setUploadedFileName(acceptedFiles[0].name)
        toast.success("File uploaded successfully")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      toast.error(error instanceof Error ? error.message : "Failed to upload file")
    }
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'text/javascript': ['.js', '.ts'],
      'text/x-python': ['.py'],
      'text/x-java': ['.java'],
      'text/x-rust': ['.rs'],
      'text/x-go': ['.go'],
      'text/x-c++': ['.cpp', '.hpp']
    },
    maxFiles: userTier === 'pro' ? 10 : 1,
    onDrop: handleFileUpload,
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  });

  const generateTests = async () => {
    if (!code.trim()) {
      toast.error("Please enter some code first");
      return;
    }

    // Check if user is trying to use a pro model without pro access
    if (userTier === 'free' && selectedModel in AI_MODELS.pro) {
      toast.error("This model is only available for Pro users. Please upgrade to access GPT-4 and Claude models.");
      return;
    }

    setIsGenerating(true);
    setTestCode("");
    setAnalysisProgress(0);
    setTestDocumentation(null);

    try {
      const response = await fetch("/api/generate-tests", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
          framework: selectedFramework,
          model: selectedModel,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setTestCode(data.tests);
      setAnalysisProgress(data.coverage);
      setTestDocumentation(data.documentation);
      setTestCount(data.test_count);
      setCoverage(data.coverage);

      // Update token usage after successful generation
      const userDataResponse = await fetch("/api/user-data");
      if (userDataResponse.ok) {
        const userData = await userDataResponse.json();
        setTokenUsage(userData.token_usage);
        setTokenLimit(userData.token_limit);
      }
    } catch (error) {
      console.error("Error generating tests:", error);
      toast.error(error instanceof Error ? error.message : "Failed to generate tests. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(testCode);
    toast.success("Tests copied to clipboard!");
  };

  const handleDownload = () => {
    const blob = new Blob([testCode], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const fileName = uploadedFileName || "tests.txt";
    a.download = `${fileName.replace(/\.[^/.]+$/, '')}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  const availableModels = userTier === "pro" 
    ? { ...AI_MODELS.free, ...AI_MODELS.pro }
    : AI_MODELS.free;

  const modelOptions = Object.entries(availableModels).map(([value, model]) => ({
    value,
    label: model.name,
    description: model.description,
    isPro: value in AI_MODELS.pro
  }));

  return (
    <div className="pt-20 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-purple-900/10 to-teal-900/10 z-0" />
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      </div>

      <div className="container py-8 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-purple-500 to-teal-400"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            GenTest Editor
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Choose your AI model and start generating tests
          </motion.p>
        </motion.div>

        <motion.div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6 max-w-md mx-auto">
                <TabsTrigger value="code" className="data-[state=active]:bg-purple-600 text-white">
                  <Code className="h-4 w-4 mr-2" />
                  Enter Code
                </TabsTrigger>
                <TabsTrigger value="upload" className="data-[state=active]:bg-purple-600 text-white">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Files
                </TabsTrigger>
              </TabsList>

              <TabsContent value="code">
                <Card className="border border-purple-500/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-4">
                    <CardTitle className="flex items-center">
                      <FileCode className="h-5 w-5 mr-2 text-purple-500" />
                      Your Code
                    </CardTitle>
                    <CardDescription>
                      Enter your code below to generate tests
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <Textarea
                      className="min-h-[300px] font-mono"
                      value={code}
                      onChange={(e) => setCode(e.target.value)}
                      placeholder="Enter your code here..."
                    />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="upload">
                <Card className="border border-purple-500/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-4">
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2 text-purple-500" />
                      Upload Your Code Files
                    </CardTitle>
                    <CardDescription>
                      {userTier === 'pro' 
                        ? "Upload multiple files to generate tests"
                        : "Upload a single file to generate tests"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
                        ${isDragActive || isDragging
                          ? 'border-purple-500 bg-purple-500/10'
                          : 'border-gray-300 hover:border-purple-500 hover:bg-purple-500/5'
                        }`}
                    >
                      <input {...getInputProps()} />
                      <div className="flex flex-col items-center gap-4">
                        <Upload className={`h-12 w-12 ${isDragActive || isDragging ? 'text-purple-500' : 'text-gray-400'}`} />
                        <div className="space-y-2">
                          <p className="text-lg font-medium">
                            {isDragActive || isDragging
                              ? "Drop your files here"
                              : "Drag and drop your files here"}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            or click to select files
                          </p>
                        </div>
                        {uploadedFileName && (
                          <div className="mt-2 flex items-center gap-2 bg-purple-500/10 px-4 py-2 rounded-md">
                            <FileText className="h-4 w-4 text-purple-500" />
                            <span className="text-sm font-medium">{uploadedFileName}</span>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                          Supported formats: .js, .ts, .py, .java, .rs, .go, .cpp, .hpp
                        </p>
                        {userTier === 'free' && (
                          <div className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                            <Info className="h-4 w-4 text-purple-500" />
                            <span>Free users can upload one file at a time</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            {testCode && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6"
              >
                <Card className="border border-purple-500/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-4">
                    <div className="flex justify-between items-center">
                      <CardTitle className="flex items-center">
                        <GitBranch className="h-5 w-5 mr-2 text-purple-500" />
                        Generated Tests
                      </CardTitle>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleCopy}
                        >
                          <Copy className="h-4 w-4 mr-2" />
                          Copy
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDownload}
                        >
                          <DownloadCloud className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    </div>
                    <CardDescription>
                      Generated using {modelOptions.find(option => option.value === selectedModel)?.label || selectedModel}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="relative">
                      <Textarea
                        className="min-h-[300px] font-mono"
                        value={testCode}
                        readOnly
                      />
                    </div>
                    {testDocumentation && userTier === 'pro' && (
                      <div className="mt-4 space-y-6">
                        <div className="p-6 bg-purple-500/5 rounded-lg border border-purple-500/10">
                          <div className="flex items-center gap-2 text-purple-500 mb-4">
                            <Info className="h-5 w-5" />
                            <h3 className="text-lg font-semibold">Test Documentation</h3>
                          </div>

                          <div className="space-y-6">
                            {/* Overview Section */}
                            <div>
                              <h4 className="text-base font-medium mb-2">Test Generation Overview</h4>
                              <p className="text-sm text-muted-foreground">
                                Our AI-powered test generator creates comprehensive test suites that:
                              </p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                                <li>Automatically detect and test all functions and methods in your code</li>
                                <li>Generate both unit tests and integration tests based on code complexity</li>
                                <li>Include edge cases and error scenarios for robust testing</li>
                                <li>Follow best practices for test organization and readability</li>
                              </ul>
                            </div>

                            {/* Test Structure Section */}
                            <div>
                              <h4 className="text-base font-medium mb-2">Generated Test Structure</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                The generated tests follow a clear structure:
                              </p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                                <li>Unit tests for individual functions with multiple test cases</li>
                                <li>Integration tests for function interactions and data flow</li>
                                <li>Error handling tests for invalid inputs and edge cases</li>
                                <li>Performance tests for critical functions when applicable</li>
                              </ul>
                            </div>

                            {/* Coverage Analysis */}
                            <div>
                              <h4 className="text-base font-medium mb-2">Test Coverage Analysis</h4>
                              <div className="flex items-center gap-4 mb-4">
                                <div className="flex items-center gap-2">
                                  <Progress value={coverage} className="w-32 h-2" />
                                  <span className="text-sm font-medium">{coverage}% Coverage</span>
                                </div>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                The test suite covers {coverage}% of your code, including:
                              </p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                                <li>Function input/output validation</li>
                                <li>Error handling paths</li>
                                <li>Edge cases and boundary conditions</li>
                                <li>Integration points between components</li>
                              </ul>
                            </div>

                            {/* Framework Implementation */}
                            <div>
                              <h4 className="text-base font-medium mb-2">Framework-Specific Implementation</h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                Tests leverage {selectedFramework}'s features for optimal testing:
                              </p>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                                <li>Built-in assertions and matchers</li>
                                <li>Test organization and grouping</li>
                                <li>Mocking and stubbing capabilities</li>
                                <li>Asynchronous test handling</li>
                              </ul>
                            </div>

                            {/* Testing Best Practices */}
                            <div>
                              <h4 className="text-base font-medium mb-2">Testing Best Practices</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                                <li>Clear and descriptive test names</li>
                                <li>Isolated test cases with proper setup/teardown</li>
                                <li>Comprehensive test coverage of all code paths</li>
                                <li>Meaningful error messages and assertions</li>
                              </ul>
                            </div>

                            {/* Implementation Notes */}
                            <div>
                              <h4 className="text-base font-medium mb-2">Implementation Notes</h4>
                              <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
                                <li>Tests are generated with proper imports and dependencies</li>
                                <li>Mock objects are created for external dependencies</li>
                                <li>Test data is isolated and reproducible</li>
                                <li>Tests follow the Arrange-Act-Assert pattern</li>
                              </ul>
                            </div>

                            {/* Running Tests */}
                            <div>
                              <h4 className="text-base font-medium mb-2">Running These Tests</h4>
                              <pre className="bg-zinc-950 text-zinc-50 p-4 rounded-lg text-sm font-mono mb-4">
{`// Install dependencies
npm install --save-dev ${selectedFramework}
// Run tests
npx ${selectedFramework}`}
                              </pre>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                    {testDocumentation && userTier === 'free' && (
                      <div className="mt-4 p-4 bg-purple-500/5 rounded-lg border border-purple-500/10">
                        <div className="flex items-center gap-2 text-purple-500">
                          <Sparkles className="h-5 w-5" />
                          <h3 className="text-lg font-semibold">Pro Feature</h3>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">
                          Detailed test documentation is available for Pro users. Upgrade to access comprehensive test analysis, coverage details, and implementation guides.
                        </p>
                        <Button
                          variant="outline"
                          className="w-full mt-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium shadow-md"
                          onClick={() => router.push('/pricing')}
                        >
                          Upgrade to Pro
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            <Card className="border border-purple-500/20 shadow-lg sticky top-24">
              <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-3">
                <CardTitle className="flex items-center text-lg">
                  <Brain className="h-5 w-5 mr-2 text-purple-500" />
                  AI Model Selection
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4 space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Select AI Model</label>
                  <Select value={selectedModel} onValueChange={(value) => setSelectedModel(value)}>
                    <SelectTrigger className="w-full h-12 text-base">
                      <SelectValue placeholder="Select a model">
                        {modelOptions.find(option => option.value === selectedModel)?.label || "Select a model"}
                      </SelectValue>
                    </SelectTrigger>
                    <SelectContent>
                      {modelOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-base py-2">
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                              <span className="font-medium">{option.label}</span>
                              {option.isPro && (
                                <Badge variant="secondary" className="bg-purple-500/10 text-purple-500 text-xs">
                                  Pro
                                </Badge>
                              )}
                            </div>
                            <span className="text-sm text-muted-foreground">
                              {option.description}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Token Usage</span>
                    <span>{tokenUsage}/{tokenLimit} tokens</span>
                  </div>
                  <Progress value={(tokenUsage / tokenLimit) * 100} className="h-2" />
                </div>

                <div className="pt-4">
                  <Button
                    onClick={generateTests}
                    disabled={isGenerating || !code.trim()}
                    className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium shadow-md"
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      "Generate Tests"
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            {userTier === "free" && (
              <Card className="border border-purple-500/20 shadow-lg">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-3">
                  <CardTitle className="flex items-center text-lg">
                    <Sparkles className="h-5 w-5 mr-2 text-purple-500" />
                    Upgrade to Pro
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                        <Sparkles className="h-3 w-3 mr-1" />
                        More Models
                      </Badge>
                      <span className="text-sm">Access to GPT-4 and Claude models</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                        <Zap className="h-3 w-3 mr-1" />
                        Higher Limits
                      </Badge>
                      <span className="text-sm">100,000 tokens per month</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary" className="bg-purple-500/10 text-purple-500">
                        <FileCode className="h-3 w-3 mr-1" />
                        Advanced Features
                      </Badge>
                      <span className="text-sm">Custom test templates and patterns</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    className="w-full mt-4 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium shadow-md"
                    onClick={() => router.push('/pricing')}
                  >
                    Upgrade Now
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </motion.div>

        {error && (
          <div className="mt-4 p-4 bg-red-100 text-red-700 rounded-lg">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditorPage; 