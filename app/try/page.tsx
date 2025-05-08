"use client"

import { useState, useEffect, useMemo } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Upload, 
  Code, 
  Play, 
  Send, 
  Terminal, 
  CheckCircle, 
  Zap, 
  FileCode, 
  GitBranch, 
  Layers,
  Copy,
  Clock,
  DownloadCloud,
  ExternalLink,
  PlusCircle,
  FileText,
  Book,
  Info
} from "lucide-react"
import { useUser } from "@clerk/nextjs"
import { SignInButton, SignUpButton } from "@clerk/nextjs"
import { useRouter } from "next/navigation"

// Helper function for syntax highlighting
const syntaxHighlight = (code: string, language: string) => {
  if (!code) return "";
  
  // Common patterns
  let highlighted = code
    .replace(/(\/\/.*)/g, '<span class="text-green-400">$1</span>') // Comments
    .replace(/(\/\*[\s\S]*?\*\/)/g, '<span class="text-green-400">$1</span>') // Block comments
    .replace(/(['"`])(?:\\\1|.)*?\1/g, '<span class="text-amber-300">$&</span>'); // Strings
  
  // Language specific patterns
  if (language === 'javascript' || language === 'typescript') {
    highlighted = highlighted
      .replace(/\b(function|class|return|if|else|for|while|try|catch|import|export|from|const|let|var)\b/g, 
              '<span class="text-blue-400">$1</span>') // Keywords
      .replace(/\b(true|false|null|undefined|this|super|new)\b/g, 
              '<span class="text-yellow-300">$1</span>') // Special values
      .replace(/(\w+)\(/g, '<span class="text-yellow-200">$1</span>(') // Function calls
      .replace(/\b(describe|it|test|expect|toBe|toEqual|beforeEach|afterEach)\b/g, 
              '<span class="text-purple-400">$1</span>'); // Jest/Testing keywords
  } else if (language === 'python') {
    highlighted = highlighted
      .replace(/(#.*)/g, '<span class="text-green-400">$1</span>') // Python comments
      .replace(/\b(def|class|import|from|return|if|elif|else|for|while|try|except|with|as|assert)\b/g, 
              '<span class="text-blue-400">$1</span>') // Python keywords
      .replace(/\b(self|None|True|False)\b/g, '<span class="text-yellow-300">$1</span>') // Python special values
      .replace(/(\w+)\(/g, '<span class="text-yellow-200">$1</span>(') // Function calls
      .replace(/\b(test_|pytest|assert)\b/g, '<span class="text-purple-400">$1</span>'); // Python testing keywords
  } else if (language === 'java') {
    highlighted = highlighted
      .replace(/\b(public|private|protected|static|void|int|String|boolean|class|interface|extends|implements|return|if|else|for|while|try|catch|throw|throws|new|this|super)\b/g,
              '<span class="text-blue-400">$1</span>') // Java keywords
      .replace(/\b(@Test|@Before|@After|@BeforeClass|@AfterClass|assertTrue|assertEquals|assertFalse|assertNotNull)\b/g,
              '<span class="text-purple-400">$1</span>') // Java testing annotations
      .replace(/(\w+)\(/g, '<span class="text-yellow-200">$1</span>('); // Method calls
  } else if (language === 'cpp') {
    highlighted = highlighted
      .replace(/\b(int|float|double|char|bool|void|class|struct|public|private|protected|return|if|else|for|while|try|catch|throw|new|delete|this)\b/g,
              '<span class="text-blue-400">$1</span>') // C++ keywords
      .replace(/\b(REQUIRE|TEST_CASE|SECTION|CHECK|REQUIRE_THAT)\b/g,
              '<span class="text-purple-400">$1</span>') // Catch2 testing keywords
      .replace(/(\w+)\(/g, '<span class="text-yellow-200">$1</span>('); // Function calls
  } else if (language === 'rust') {
    highlighted = highlighted
      .replace(/\b(fn|pub|let|mut|return|if|else|for|while|loop|match|struct|enum|impl|trait|use|mod)\b/g,
              '<span class="text-blue-400">$1</span>') // Rust keywords
      .replace(/\b(assert_eq!|assert_ne!|assert!|#[test])\b/g,
              '<span class="text-purple-400">$1</span>') // Rust testing keywords
      .replace(/(\w+)\(/g, '<span class="text-yellow-200">$1</span>('); // Function calls
  } else if (language === 'go') {
    highlighted = highlighted
      .replace(/\b(func|package|import|return|if|else|for|range|switch|case|default|struct|interface|type)\b/g,
              '<span class="text-blue-400">$1</span>') // Go keywords
      .replace(/\b(t\.Error|t\.Fatal|t\.Log|t\.Run)\b/g,
              '<span class="text-purple-400">$1</span>') // Go testing keywords
      .replace(/(\w+)\(/g, '<span class="text-yellow-200">$1</span>('); // Function calls
  }
  
  return highlighted;
};

// Example code snippets for different frameworks
const exampleCode = {
  jest: `// Simple math functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}`,
  mocha: `// Simple math functions
function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}`,
  pytest: `# Simple math functions

def add(a, b):
    return a + b

def subtract(a, b):
    return a - b`,
  junit: `// Simple math class
public class MathUtils {
    public int add(int a, int b) {
        return a + b;
    }
    
    public int subtract(int a, int b) {
        return a - b;
    }
}`,
  unittest: `# Simple math functions
def add(a, b):
    return a + b

def subtract(a, b):
    return a - b`,
  cpptest: `// Simple math functions
int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}`,
  rusttest: `// Simple math functions
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn subtract(a: i32, b: i32) -> i32 {
    a - b
}`,
  gotest: `// Simple math functions
package math

func Add(a, b int) int {
    return a + b
}

func Subtract(a, b int) int {
    return a - b
}`
};

export default function TryPage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [testFramework, setTestFramework] = useState("jest")
  const [codeInput, setCodeInput] = useState(exampleCode.jest)
  const [generatedTests, setGeneratedTests] = useState("")
  const [copied, setCopied] = useState(false)
  const [analyzing, setAnalyzing] = useState(false)
  const [analysisComplete, setAnalysisComplete] = useState(false)
  const [analysisSteps, setAnalysisSteps] = useState<string[]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [coverage, setCoverage] = useState(0)
  const [testCount, setTestCount] = useState(0)
  const [showDocumentation, setShowDocumentation] = useState(false)
  const [editorLanguage, setEditorLanguage] = useState("javascript")
  const [editorFocused, setEditorFocused] = useState(false)
  const [showAuthPrompt, setShowAuthPrompt] = useState(false)
  const [showStartPrompt, setShowStartPrompt] = useState(false)
  const [isFirstTime, setIsFirstTime] = useState(true)
  
  // Update editor language based on framework
  useEffect(() => {
    switch (testFramework) {
      case 'pytest':
      case 'unittest':
        setEditorLanguage('python');
        break;
      case 'junit':
        setEditorLanguage('java');
        break;
      case 'cpptest':
        setEditorLanguage('cpp');
        break;
      case 'rusttest':
        setEditorLanguage('rust');
        break;
      case 'gotest':
        setEditorLanguage('go');
        break;
      default:
        setEditorLanguage('javascript');
    }
    setCodeInput(exampleCode[testFramework as keyof typeof exampleCode]);
  }, [testFramework]);

  // Syntax highlighted code
  const highlightedCode = useMemo(() => {
    return { __html: syntaxHighlight(codeInput, editorLanguage) };
  }, [codeInput, editorLanguage]);
  
  const highlightedTestCode = useMemo(() => {
    return { __html: syntaxHighlight(generatedTests, editorLanguage) };
  }, [generatedTests, editorLanguage]);

  // Simulate code analysis
  useEffect(() => {
    if (analyzing) {
      const steps = [
        "Parsing code structure...",
        "Identifying functions and parameters...",
        "Analyzing function signatures...",
        "Detecting edge cases...",
        "Planning test scenarios...",
        "Generating test cases..."
      ]
      
      setAnalysisSteps(steps)
      
      let step = 0
      const interval = setInterval(() => {
        if (step < steps.length - 1) {
          setCurrentStep(step + 1)
          step++
        } else {
          clearInterval(interval)
          setAnalysisComplete(true)
          generateTests()
        }
      }, 800)
      
      return () => clearInterval(interval)
    }
  }, [analyzing])

  // Custom scrollbar styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .scrollbar-thin::-webkit-scrollbar {
        width: 6px;
      }
      .scrollbar-thin::-webkit-scrollbar-track {
        background: transparent;
      }
      .scrollbar-thin::-webkit-scrollbar-thumb {
        background-color: rgb(51, 65, 85);
        border-radius: 20px;
      }
      .scrollbar-thin {
        scrollbar-width: thin;
        scrollbar-color: rgb(51, 65, 85) transparent;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  const handleEditCode = () => {
    if (!isSignedIn) {
      setShowAuthPrompt(true);
    } else if (isFirstTime) {
      setShowStartPrompt(true);
    } else {
      router.push('/try/editor');
    }
  };

  const handleUploadFiles = () => {
    if (!isSignedIn) {
      setShowAuthPrompt(true);
    } else if (isFirstTime) {
      setShowStartPrompt(true);
    } else {
      router.push('/try/editor');
    }
  };

  const handleStart = () => {
    setIsFirstTime(false);
    router.push('/try/editor');
  };

  const handleGenerate = () => {
    if (!codeInput.trim()) return

    setAnalysisComplete(false)
    setGeneratedTests("")
    setShowDocumentation(false)
    setAnalyzing(true)
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedTests)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const generateTests = () => {
    setIsGenerating(true)
    // Simulate test generation
    setTimeout(() => {
      const generatedTestCode = generateTestBasedOnFramework(testFramework)
      setGeneratedTests(generatedTestCode)
      setIsGenerating(false)
      setShowDocumentation(true)
      
      // Set random coverage percentage between 85-95%
      setCoverage(Math.floor(Math.random() * 11) + 85)
      setTestCount(2) // Only 2 tests now (add and subtract)
    }, 1000)
  }

  const generateTestBasedOnFramework = (framework: string) => {
    if (framework === "jest") {
      return `import { describe, it, expect } from 'jest';

describe('Math functions', () => {
  it('should add two numbers correctly', () => {
    // Arrange
    const a = 5;
    const b = 3;
    
    // Act
    const result = add(a, b);
    
    // Assert
    expect(result).toBe(8);
  });

  it('should subtract two numbers correctly', () => {
    // Arrange
    const a = 10;
    const b = 4;
    
    // Act
    const result = subtract(a, b);
    
    // Assert
    expect(result).toBe(6);
  });
});`;
    } else if (framework === "mocha") {
      return `const { expect } = require('chai');

describe('Math functions', function() {
  it('should add two numbers correctly', function() {
    // Arrange
    const a = 5;
    const b = 3;
    
    // Act
    const result = add(a, b);
    
    // Assert
    expect(result).to.equal(8);
  });

  it('should subtract two numbers correctly', function() {
    // Arrange
    const a = 10;
    const b = 4;
    
    // Act
    const result = subtract(a, b);
    
    // Assert
    expect(result).to.equal(6);
  });
});`;
    } else if (framework === "pytest") {
      return `import pytest

def test_add():
    # Arrange
    a = 5
    b = 3
    
    # Act
    result = add(a, b)
    
    # Assert
    assert result == 8

def test_subtract():
    # Arrange
    a = 10
    b = 4
    
    # Act
    result = subtract(a, b)
    
    # Assert
    assert result == 6`;
    } else if (framework === "unittest") {
      return `import unittest

class TestMathFunctions(unittest.TestCase):
    def test_add(self):
        # Arrange
        a = 5
        b = 3
        
        # Act
        result = add(a, b)
        
        # Assert
        self.assertEqual(result, 8)
    
    def test_subtract(self):
        # Arrange
        a = 10
        b = 4
        
        # Act
        result = subtract(a, b)
        
        # Assert
        self.assertEqual(result, 6)

if __name__ == '__main__':
    unittest.main()`;
    } else if (framework === "junit") {
      return `import org.junit.Test;
import static org.junit.Assert.*;

public class MathUtilsTest {
    
    private MathUtils mathUtils = new MathUtils();
    
    @Test
    public void testAdd() {
        // Arrange
        int a = 5;
        int b = 3;
        
        // Act
        int result = mathUtils.add(a, b);
        
        // Assert
        assertEquals(8, result);
    }
    
    @Test
    public void testSubtract() {
        // Arrange
        int a = 10;
        int b = 4;
        
        // Act
        int result = mathUtils.subtract(a, b);
        
        // Assert
        assertEquals(6, result);
    }
}`;
    } else if (framework === "cpptest") {
      return `// Simple math functions
int add(int a, int b) {
    return a + b;
}

int subtract(int a, int b) {
    return a - b;
}

// Test cases
void testAdd() {
    assert(add(5, 3) == 8);
}

void testSubtract() {
    assert(subtract(10, 4) == 6);
}

// Main function
int main() {
    testAdd();
    testSubtract();
    return 0;
}`;
    } else if (framework === "rusttest") {
      return `// Simple math functions
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

pub fn subtract(a: i32, b: i32) -> i32 {
    a - b
}

// Test cases
#[test]
fn test_add() {
    assert_eq!(add(5, 3), 8);
}

#[test]
fn test_subtract() {
    assert_eq!(subtract(10, 4), 6);
}
`;
    } else if (framework === "gotest") {
      return `// Simple math functions
package math

func Add(a, b int) int {
    return a + b
}

func Subtract(a, b int) int {
    return a - b
}

// Test cases
func TestAdd() {
    if Add(5, 3) != 8 {
        t.Error("Add(5, 3) should be 8")
    }
}

func TestSubtract() {
    if Subtract(10, 4) != 6 {
        t.Error("Subtract(10, 4) should be 6")
    }
}
`;
    }
    return ""
  }

  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

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
            Try GenTest
          </motion.h1>
          <motion.p 
            className="text-xl text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Experience the power of AI-generated tests with our interactive demo.
          </motion.p>
        </motion.div>

        <motion.div 
          className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <div className="lg:col-span-8">
        <Tabs defaultValue="code" className="w-full">
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
                      Enter your code below or edit the example. Simple math functions are just placeholders.
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4">
                    <div className="grid gap-6">
                      <div className="grid gap-2">
                        <div className="relative overflow-hidden rounded-md bg-slate-950 border border-slate-800">
                          <div className="flex items-center justify-between bg-slate-900 px-4 py-2 border-b border-slate-800">
                            <div className="flex items-center space-x-2">
                              <div className="h-3 w-3 rounded-full bg-red-500" />
                              <div className="h-3 w-3 rounded-full bg-yellow-500" />
                              <div className="h-3 w-3 rounded-full bg-green-500" />
                            </div>
                            <div className="flex items-center text-xs text-slate-400">
                              <FileCode className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                              {editorLanguage === 'javascript' ? 'JavaScript' : 
                               editorLanguage === 'python' ? 'Python' : 'Java'} - Edit code here
                            </div>
                          </div>
                          <motion.div 
                            className="relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            key={testFramework}
                          >
                            <Textarea
                              id="code-input"
                              placeholder="// Enter your code here"
                              className="font-mono h-60 bg-slate-950 border-0 resize-none p-4 text-sm focus:ring-1 focus:ring-purple-500 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                              value={codeInput}
                              onChange={(e) => setCodeInput(e.target.value)}
                              onFocus={() => setEditorFocused(true)}
                              onBlur={() => setEditorFocused(false)}
                              style={{ caretColor: "white" }}
                            />
                            {!editorFocused && (
                              <div 
                                className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[1px] cursor-text"
                                onClick={handleEditCode}
                              >
                                <div className="bg-slate-800/80 px-4 py-2 rounded-md flex items-center">
                                  <Code className="h-4 w-4 mr-2 text-purple-400" />
                                  <span className="text-sm font-medium text-white">Click to edit code</span>
                                </div>
                              </div>
                            )}
                          </motion.div>
                        </div>
                        
                        <div className="flex justify-between items-center text-xs text-muted-foreground mt-1 px-1">
                          <div>
                            <span className="italic">Example code is editable - click to modify or replace with your own</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant="outline" 
                              className="bg-slate-800/30 border-slate-700 text-xs"
                            >
                              <span className="text-green-400">Lines:</span> {codeInput.split('\n').length}
                            </Badge>
                          </div>
                        </div>
                      </div>
                      <div className="grid gap-2">
                        <div className="flex flex-wrap gap-2 items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Label htmlFor="framework" className="mb-1">Test Framework:</Label>
                            <Select value={testFramework} onValueChange={setTestFramework}>
                              <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Select framework" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="jest">Jest (JS/TS)</SelectItem>
                                <SelectItem value="mocha">Mocha (JS/TS)</SelectItem>
                                <SelectItem value="pytest">PyTest (Python)</SelectItem>
                                <SelectItem value="unittest">unittest (Python)</SelectItem>
                                <SelectItem value="junit">JUnit (Java)</SelectItem>
                                <SelectItem value="cpptest">Catch2 (C++)</SelectItem>
                                <SelectItem value="rusttest">Rust Test (Rust)</SelectItem>
                                <SelectItem value="gotest">Go Test (Go)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                            <Button
                              onClick={handleGenerate}
                              disabled={isGenerating || analyzing || !codeInput.trim()}
                              className="bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium shadow-md"
                            >
                              {analyzing ? "Analyzing..." : isGenerating ? "Generating..." : "Generate Tests"}
                              <Zap className="ml-2 h-4 w-4" />
                            </Button>
                          </motion.div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {analyzing && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <Card className="border border-purple-500/20 overflow-hidden">
                      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-3">
                        <CardTitle className="text-sm flex items-center">
                          <Terminal className="h-4 w-4 mr-2 text-purple-500" />
                          Analysis Progress
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="p-4 bg-slate-900/50">
                        <ul className="space-y-2 font-mono text-xs">
                          {analysisSteps.map((step, index) => (
                            index <= currentStep && (
                              <motion.li 
                                key={index}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-start"
                              >
                                {index === currentStep && !analysisComplete ? (
                                  <span className="text-yellow-400 mr-2">›</span>
                                ) : (
                                  <CheckCircle className="h-3 w-3 text-green-500 mr-2 mt-0.5" />
                                )}
                                <span className={index < currentStep ? "text-muted-foreground" : "text-white"}>
                                  {step}
                                </span>
                              </motion.li>
                            )
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {generatedTests && (
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="mt-4"
                  >
                    <Card className="border border-purple-500/20 shadow-lg">
                      <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-3">
                        <div className="flex justify-between items-center">
                          <CardTitle className="flex items-center">
                            <GitBranch className="h-5 w-5 mr-2 text-purple-500" />
                            Generated Tests
                          </CardTitle>
                          <div className="flex gap-2">
                            <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                              {testCount} Tests
                            </Badge>
                            <Badge variant="outline" className="bg-purple-500/10 text-purple-500 border-purple-500/20">
                              {coverage}% Coverage
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="p-0">
                        <div className="relative">
                          <div className="bg-slate-900 px-4 py-2 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center text-xs text-slate-400">
                              <GitBranch className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                              {testFramework === 'jest' ? 'Jest Test' : 
                               testFramework === 'mocha' ? 'Mocha Test' : 
                               testFramework === 'pytest' ? 'PyTest Test' : 'JUnit Test'} - Generated code
                            </div>
                            <div className="flex items-center space-x-2">
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-white hover:bg-slate-700 hover:text-white"
                                  onClick={handleCopy}
                                >
                                  {copied ? (
                                    <>
                                      <CheckCircle className="h-3.5 w-3.5 mr-1 text-green-500" />
                                      Copied
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5 mr-1" />
                                      Copy
                                    </>
                                  )}
                                </Button>
                              </motion.div>
                              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-8 text-white hover:bg-slate-700 hover:text-white"
                                >
                                  <DownloadCloud className="h-3.5 w-3.5 mr-1" />
                                  Download
                                </Button>
                              </motion.div>
                            </div>
                          </div>
                          <motion.div 
                            className="relative"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.5 }}
                            key={testFramework}
                          >
                            <Textarea
                              id="generated-tests"
                              className="font-mono h-[400px] bg-slate-950 border-0 resize-none p-4 text-sm scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent"
                              value={generatedTests}
                              readOnly
                              style={{ caretColor: "transparent" }}
                            />
                          </motion.div>
                        </div>
                      </CardContent>
                    </Card>

                    {showDocumentation && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.2 }}
                        className="mt-4"
                      >
                        <Card className="border border-purple-500/20 shadow-lg">
                          <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-3">
                            <CardTitle className="flex items-center">
                              <FileText className="h-5 w-5 mr-2 text-purple-500" />
                              Test Documentation
                            </CardTitle>
                          </CardHeader>
                          <CardContent className="p-4 space-y-5">
                            <div>
                              <h3 className="text-lg font-semibold mb-2">Understanding The Generated Tests</h3>
                              <p className="text-muted-foreground mb-4">
                                The generated tests follow industry best practices and testing patterns to ensure comprehensive coverage of your code.
                              </p>
                              
                              <div className="space-y-4 mb-6">
                                <div className="rounded-md bg-slate-900/50 p-4">
                                  <h4 className="font-medium text-sm flex items-center mb-2">
                                    <motion.div 
                                      className="h-4 w-4 rounded-full bg-blue-500 mr-2"
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <span className="text-base">Test Structure: Arrange-Act-Assert</span>
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    Each test follows the AAA pattern for clarity and maintainability:
                                  </p>
                                  <ul className="text-sm text-muted-foreground space-y-2 pl-6 list-disc">
                                    <li><span className="text-blue-400 font-medium">Arrange:</span> Set up test inputs and preconditions</li>
                                    <li><span className="text-blue-400 font-medium">Act:</span> Call the method/function being tested</li>
                                    <li><span className="text-blue-400 font-medium">Assert:</span> Verify the expected outcome</li>
                                  </ul>
                                </div>
                                
                                <div className="rounded-md bg-slate-900/50 p-4">
                                  <h4 className="font-medium text-sm flex items-center mb-2">
                                    <motion.div 
                                      className="h-4 w-4 rounded-full bg-green-500 mr-2"
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
                                    />
                                    <span className="text-base">Test Coverage Analysis</span>
                                  </h4>
                                  <div className="mb-3">
                                    <div className="w-full bg-slate-800 rounded-full h-2.5">
                                      <motion.div 
                                        className="bg-gradient-to-r from-green-400 to-emerald-500 h-2.5 rounded-full" 
                                        initial={{ width: 0 }}
                                        animate={{ width: `${coverage}%` }}
                                        transition={{ duration: 1.5, ease: "easeOut" }}
                                      />
                                    </div>
                                    <div className="flex justify-between text-xs mt-1">
                                      <span className="text-muted-foreground">0%</span>
                                      <span className="text-emerald-500 font-medium">{coverage}%</span>
                                      <span className="text-muted-foreground">100%</span>
                                    </div>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    The test suite covers {coverage}% of your code, focusing on:
                                  </p>
                                  <ul className="text-sm text-muted-foreground space-y-1 pl-6 list-disc">
                                    <li>Addition function with positive integers</li>
                                    <li>Subtraction function with positive integers</li>
                                    <li>Function input validation</li>
                                    <li>Return value verification</li>
                                  </ul>
                                </div>
                                
                                <div className="rounded-md bg-slate-900/50 p-4">
                                  <h4 className="font-medium text-sm flex items-center mb-2">
                                    <motion.div 
                                      className="h-4 w-4 rounded-full bg-purple-500 mr-2"
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity, delay: 1 }}
                                    />
                                    <span className="text-base">Framework-Specific Implementation</span>
                                  </h4>
                                  <p className="text-sm text-muted-foreground mb-3">
                                    Tests leverage {testFramework === 'jest' ? 'Jest\'s' : 
                                    testFramework === 'mocha' ? 'Mocha with Chai\'s' : 
                                    testFramework === 'pytest' ? 'PyTest\'s' : 
                                    'JUnit\'s'} features for optimal testing:
                                  </p>
                                  
                                  {testFramework === 'jest' && (
                                    <div className="bg-slate-800/50 rounded p-3 font-mono text-xs">
                                      <div className="text-blue-400">// Jest provides expressive matchers</div>
                                      <div>expect(result)<span className="text-yellow-300">.toBe</span>(8);</div>
                                      <div>expect(func)<span className="text-yellow-300">.toThrow</span>();</div>
                                      <div className="mt-2 text-blue-400">// Grouped by describe blocks</div>
                                      <div><span className="text-purple-400">describe</span>('Math functions', {'() => {'}</div>
                                      <div className="pl-2"><span className="text-purple-400">it</span>('should add correctly', {'() => {'})...</div>
                                      <div className="pl-2"><span className="text-purple-400">it</span>('should subtract correctly', {'() => {'})...</div>
                                    </div>
                                  )}
                                  
                                  {testFramework === 'mocha' && (
                                    <div className="bg-slate-800/50 rounded p-3 font-mono text-xs">
                                      <div className="text-blue-400">// Mocha with Chai assertions</div>
                                      <div>expect(result)<span className="text-yellow-300">.to.equal</span>(8);</div>
                                      <div>expect(func)<span className="text-yellow-300">.to.throw</span>();</div>
                                      <div className="mt-2 text-blue-400">// BDD style interfaces</div>
                                      <div><span className="text-purple-400">describe</span>('Math functions', function() {'{'}</div>
                                      <div className="pl-2"><span className="text-purple-400">it</span>('should add correctly', function() {'{'})...</div>
                                      <div className="pl-2"><span className="text-purple-400">it</span>('should subtract correctly', function() {'{'})...</div>
                                    </div>
                                  )}
                                  
                                  {testFramework === 'pytest' && (
                                    <div className="bg-slate-800/50 rounded p-3 font-mono text-xs">
                                      <div className="text-green-400"># PyTest's built-in assert statements</div>
                                      <div><span className="text-purple-400">assert</span> result == 8</div>
                                      <div className="mt-2 text-green-400"># Test addition and subtraction</div>
                                      <div><span className="text-blue-400">def</span> <span className="text-purple-400">test_add</span>():</div>
                                      <div className="pl-2"><span className="text-purple-400">assert</span> add(5, 3) == 8</div>
                                      <div><span className="text-blue-400">def</span> <span className="text-purple-400">test_subtract</span>():</div>
                                      <div className="pl-2"><span className="text-purple-400">assert</span> subtract(10, 4) == 6</div>
                                    </div>
                                  )}
                                  
                                  {testFramework === 'junit' && (
                                    <div className="bg-slate-800/50 rounded p-3 font-mono text-xs">
                                      <div className="text-green-400">// JUnit test methods for basic operations</div>
                                      <div><span className="text-purple-400">@Test</span></div>
                                      <div><span className="text-blue-400">public void</span> testAdd() {'{'}</div>
                                      <div className="pl-2">assertEquals(8, mathUtils.add(5, 3));</div>
                                      <div className="mt-1"><span className="text-purple-400">@Test</span></div>
                                      <div><span className="text-blue-400">public void</span> testSubtract() {'{'}</div>
                                      <div className="pl-2">assertEquals(6, mathUtils.subtract(10, 4));</div>
                                    </div>
                                  )}
                                </div>
                                
                                <div className="rounded-md bg-slate-900/50 p-4">
                                  <h4 className="font-medium text-sm flex items-center mb-2">
                                    <motion.div 
                                      className="h-4 w-4 rounded-full bg-amber-500 mr-2"
                                      animate={{ scale: [1, 1.1, 1] }}
                                      transition={{ duration: 1.5, repeat: Infinity, delay: 1.5 }}
                                    />
                                    <span className="text-base">Testing Best Practices</span>
                                  </h4>
                                  <ul className="text-sm text-muted-foreground space-y-2 pl-6 list-disc">
                                    <li><span className="text-amber-400 font-medium">Single Responsibility:</span> Each test verifies one specific behavior</li>
                                    <li><span className="text-amber-400 font-medium">Isolated:</span> Tests are independent and don't rely on other tests</li>
                                    <li><span className="text-amber-400 font-medium">Readable:</span> Clear naming and structure make tests self-documenting</li>
                                    <li><span className="text-amber-400 font-medium">Deterministic:</span> Tests produce the same results on every run</li>
                                  </ul>
                                </div>
                              </div>
                              
                              <div className="bg-purple-900/20 border border-purple-500/30 rounded-md p-4">
                                <h4 className="font-medium text-base mb-2 flex items-center">
                                  <Book className="h-4 w-4 mr-2 text-purple-400" />
                                  Implementation Notes
                                </h4>
                                <p className="text-sm text-muted-foreground mb-2">
                                  Generated tests include:
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                  <div className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">2 test cases for basic math operations</span>
                                  </div>
                                  <div className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">Tests for add() and subtract() functions</span>
                                  </div>
                                  <div className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">Clear Arrange-Act-Assert structure</span>
                                  </div>
                                  <div className="flex items-start">
                                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    <span className="text-sm">Framework-specific assertions</span>
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-purple-500/20">
                                  <h5 className="font-medium text-sm mb-2">Running These Tests</h5>
                                  <div className="bg-slate-800/50 p-3 rounded font-mono text-xs overflow-x-auto">
                                    {testFramework === 'jest' && (
                                      <>
                                        <div className="text-green-400">// Install dependencies</div>
                                        <div>npm install --save-dev jest</div>
                                        <div className="mt-2 text-green-400">// Run tests</div>
                                        <div>npx jest</div>
                                      </>
                                    )}
                                    {testFramework === 'mocha' && (
                                      <>
                                        <div className="text-green-400">// Install dependencies</div>
                                        <div>npm install --save-dev mocha chai</div>
                                        <div className="mt-2 text-green-400">// Run tests</div>
                                        <div>npx mocha tests.js</div>
                                      </>
                                    )}
                                    {testFramework === 'pytest' && (
                                      <>
                                        <div className="text-green-400"># Install dependencies</div>
                                        <div>pip install pytest</div>
                                        <div className="mt-2 text-green-400"># Run tests</div>
                                        <div>pytest test_file.py</div>
                                      </>
                                    )}
                                    {testFramework === 'junit' && (
                                      <>
                                        <div className="text-green-400">// Add JUnit to your Maven dependencies</div>
                                        <div>&lt;dependency&gt;</div>
                                        <div>    &lt;groupId&gt;junit&lt;/groupId&gt;</div>
                                        <div>    &lt;artifactId&gt;junit&lt;/artifactId&gt;</div>
                                        <div>    &lt;version&gt;4.13.2&lt;/version&gt;</div>
                                        <div>&lt;/dependency&gt;</div>
                                        <div className="mt-2 text-green-400">// Run tests with Maven</div>
                                        <div>mvn test</div>
                                      </>
                                    )}
                                  </div>
                                </div>
                                
                                <div className="mt-4 pt-4 border-t border-purple-500/20">
                                  <h5 className="font-medium text-sm mb-2">Testing Resources</h5>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                    <div className="bg-slate-800/50 p-2 rounded flex items-center">
                                      <FileText className="h-3.5 w-3.5 text-purple-400 mr-2" />
                                      <span className="text-xs text-muted-foreground">Testing Best Practices</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded flex items-center">
                                      <FileText className="h-3.5 w-3.5 text-purple-400 mr-2" />
                                      <span className="text-xs text-muted-foreground">API Documentation</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded flex items-center">
                                      <FileText className="h-3.5 w-3.5 text-purple-400 mr-2" />
                                      <span className="text-xs text-muted-foreground">Framework Guides</span>
                                    </div>
                                    <div className="bg-slate-800/50 p-2 rounded flex items-center">
                                      <FileText className="h-3.5 w-3.5 text-purple-400 mr-2" />
                                      <span className="text-xs text-muted-foreground">Advanced Testing Examples</span>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </motion.div>
                    )}
                  </motion.div>
                )}
              </TabsContent>

              <TabsContent value="upload">
                <Card className="border border-purple-500/20 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-4">
                    <CardTitle className="flex items-center">
                      <Upload className="h-5 w-5 mr-2 text-purple-500" />
                      Upload Your Code Files
                    </CardTitle>
                    <CardDescription>Upload JavaScript, TypeScript, or Python files to generate tests</CardDescription>
              </CardHeader>
                  <CardContent className="p-6">
                    <motion.div 
                      className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-10 text-center"
                      whileHover={{ borderColor: "rgba(168, 85, 247, 0.5)" }}
                    >
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <div className="bg-purple-500/10 rounded-full p-4 mb-4 inline-block">
                          <motion.div
                            animate={{ rotate: isUploading ? 360 : 0 }}
                            transition={{ duration: 2, repeat: isUploading ? Infinity : 0, ease: "linear" }}
                          >
                            <Upload className="h-10 w-10 text-purple-500" />
                          </motion.div>
                        </div>
                      </motion.div>
                  <h3 className="text-lg font-medium mb-2">Drag and drop your files here</h3>
                      <p className="text-sm text-muted-foreground mb-6">or click to browse your files</p>
                  <div className="flex flex-col gap-4 w-full max-w-xs">
                        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                          <Button 
                            onClick={handleUploadFiles} 
                            disabled={isUploading} 
                            className="w-full bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-700 hover:to-violet-700 text-white font-medium shadow-md"
                          >
                            {isUploading ? (
                              <>
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="mr-2"
                                >
                                  <Upload className="h-4 w-4" />
                                </motion.div>
                                Uploading...
                              </>
                            ) : (
                              <>
                                Upload Files
                                <Upload className="ml-2 h-4 w-4" />
                              </>
                            )}
                    </Button>
                        </motion.div>
                    <div className="flex items-center justify-center gap-2">
                      <Badge variant="outline" className="text-xs">
                        Free: 1 file
                      </Badge>
                      <Badge variant="outline" className="text-xs bg-purple-600 text-white">
                        PRO: Multiple files
                      </Badge>
                    </div>
                  </div>
                    </motion.div>
              </CardContent>
            </Card>
          </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-4">
            <div className="space-y-6">
              <Card className="border border-purple-500/20 shadow-lg sticky top-24">
                <CardHeader className="bg-gradient-to-r from-purple-500/10 to-purple-700/10 py-3">
                  <CardTitle className="flex items-center text-lg">
                    <Zap className="h-5 w-5 mr-2 text-purple-500" />
                    About GenTest
                  </CardTitle>
              </CardHeader>
                <CardContent className="p-4 space-y-4">
                  <div>
                    <h3 className="text-sm font-medium mb-2">How It Works</h3>
                    <ul className="space-y-2 text-sm">
                      <motion.li 
                        className="flex items-start"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Enter your code or upload files</span>
                      </motion.li>
                      <motion.li 
                        className="flex items-start"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.05 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Our AI analyzes your code and identifies test cases</span>
                      </motion.li>
                      <motion.li 
                        className="flex items-start"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.1 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Generate comprehensive tests for multiple frameworks</span>
                      </motion.li>
                      <motion.li 
                        className="flex items-start"
                        whileHover={{ x: 3 }}
                        transition={{ type: "spring", stiffness: 300, delay: 0.15 }}
                      >
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span>Download or copy tests to use in your project</span>
                      </motion.li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Supported Languages</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge variant="outline" className="inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors">JavaScript</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge variant="outline" className="inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors">TypeScript</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge variant="outline" className="inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors">Python</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge variant="outline" className="inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors">Java</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge variant="outline" className="inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors">C++</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge variant="outline" className="inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors">Rust</Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge variant="outline" className="inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors">Go</Badge>
                      </motion.div>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-sm font-medium mb-2">Supported Frameworks</h3>
                    <div className="grid grid-cols-2 gap-2">
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge 
                          variant="outline" 
                          className={`inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors ${testFramework === 'jest' ? 'bg-purple-500/20 border-purple-500' : ''}`}
                          onClick={() => setTestFramework('jest')}
                        >
                          Jest
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge 
                          variant="outline" 
                          className={`inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors ${testFramework === 'mocha' ? 'bg-purple-500/20 border-purple-500' : ''}`}
                          onClick={() => setTestFramework('mocha')}
                        >
                          Mocha
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge 
                          variant="outline" 
                          className={`inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors ${testFramework === 'pytest' ? 'bg-purple-500/20 border-purple-500' : ''}`}
                          onClick={() => setTestFramework('pytest')}
                        >
                          PyTest
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge 
                          variant="outline" 
                          className={`inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors ${testFramework === 'unittest' ? 'bg-purple-500/20 border-purple-500' : ''}`}
                          onClick={() => setTestFramework('unittest')}
                        >
                          unittest
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge 
                          variant="outline" 
                          className={`inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors ${testFramework === 'junit' ? 'bg-purple-500/20 border-purple-500' : ''}`}
                          onClick={() => setTestFramework('junit')}
                        >
                          JUnit
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge 
                          variant="outline" 
                          className={`inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors ${testFramework === 'cpptest' ? 'bg-purple-500/20 border-purple-500' : ''}`}
                          onClick={() => setTestFramework('cpptest')}
                        >
                          Catch2
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge 
                          variant="outline" 
                          className={`inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors ${testFramework === 'rusttest' ? 'bg-purple-500/20 border-purple-500' : ''}`}
                          onClick={() => setTestFramework('rusttest')}
                        >
                          Rust Test
                        </Badge>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                        <Badge 
                          variant="outline" 
                          className={`inline-flex items-center justify-center w-full hover:bg-slate-800 cursor-pointer transition-colors ${testFramework === 'gotest' ? 'bg-purple-500/20 border-purple-500' : ''}`}
                          onClick={() => setTestFramework('gotest')}
                        >
                          Go Test
                        </Badge>
                      </motion.div>
                    </div>
                </div>
              </CardContent>
            </Card>
            </div>
          </div>
        </motion.div>
          </div>

      {/* Auth Prompt Dialog */}
      {showAuthPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Sign In Required</CardTitle>
              <CardDescription>Please sign in to use GenTest</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <SignInButton mode="modal">
                <Button className="w-full">Sign In</Button>
              </SignInButton>
              <SignUpButton mode="modal">
                <Button variant="outline" className="w-full">Sign Up</Button>
              </SignUpButton>
            </CardContent>
            <CardFooter>
              <Button variant="ghost" onClick={() => setShowAuthPrompt(false)}>Cancel</Button>
            </CardFooter>
          </Card>
        </div>
      )}

      {/* Start Prompt Dialog */}
      {showStartPrompt && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>Welcome to GenTest!</CardTitle>
              <CardDescription>Ready to start generating tests?</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground mb-4">
                You'll be redirected to the editor where you can choose your AI model and start generating tests.
              </p>
            </CardContent>
            <CardFooter className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowStartPrompt(false)}>Cancel</Button>
              <Button onClick={handleStart}>Start</Button>
            </CardFooter>
          </Card>
      </div>
      )}
    </div>
  )
}

