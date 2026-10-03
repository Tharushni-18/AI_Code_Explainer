package com.example.codeexplainer.model;

/**
 * Data sent back to the frontend as JSON.
 * "success" tells the frontend whether things worked.
 * "message" carries a friendly error text when success = false.
 */
public class CodeResponse {

    private boolean success;
    private String message;
    private String explanation;
    private String lineByLine;
    private String logic;
    private String concepts;
    private String timeComplexity;
    private String spaceComplexity;
    private String errors;
    private String suggestions;
    private String improvedCode;
    private String programOutput;

    public CodeResponse() {
    }

    /** Helper to build an error response in one line. */
    public static CodeResponse error(String message) {
        CodeResponse response = new CodeResponse();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getExplanation() { return explanation; }
    public void setExplanation(String explanation) { this.explanation = explanation; }

    public String getLineByLine() { return lineByLine; }
    public void setLineByLine(String lineByLine) { this.lineByLine = lineByLine; }

    public String getLogic() { return logic; }
    public void setLogic(String logic) { this.logic = logic; }

    public String getConcepts() { return concepts; }
    public void setConcepts(String concepts) { this.concepts = concepts; }

    public String getTimeComplexity() { return timeComplexity; }
    public void setTimeComplexity(String timeComplexity) { this.timeComplexity = timeComplexity; }

    public String getSpaceComplexity() { return spaceComplexity; }
    public void setSpaceComplexity(String spaceComplexity) { this.spaceComplexity = spaceComplexity; }

    public String getErrors() { return errors; }
    public void setErrors(String errors) { this.errors = errors; }

    public String getSuggestions() { return suggestions; }
    public void setSuggestions(String suggestions) { this.suggestions = suggestions; }

    public String getImprovedCode() { return improvedCode; }
    public void setImprovedCode(String improvedCode) { this.improvedCode = improvedCode; }

    public String getProgramOutput() { return programOutput; }
    public void setProgramOutput(String programOutput) { this.programOutput = programOutput; }
}
