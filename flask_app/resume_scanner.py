import os
import re
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
from PyPDF2 import PdfReader
import spacy
from keybert import KeyBERT
from fuzzywuzzy import fuzz
import logging

# Initialize NLP and Keyword Extraction Models
nlp = spacy.load("en_core_web_sm")
kw_model = KeyBERT()

def extract_resume_data(pdf_path):
    try:
        with open(pdf_path, "rb") as f:
            reader = PdfReader(f)
            text = ""
            for page in reader.pages:
                text += page.extract_text() or ""

        name = extract_name(text)
        email = extract_email(text)
        contact = extract_contact(text)
        skills = extract_skills(text)

        return name, email, contact, skills
    except Exception as e:
        print(f"Error extracting resume data: {str(e)}")
        return "Unknown", "N/A", "N/A", []

def extract_name(text):
    try:
        doc = nlp(text)
        for ent in doc.ents:
            if ent.label_ == "PERSON":
                return ent.text
        name_match = re.search(r"([A-Z][a-z]+\s[A-Z][a-z]+)", text)
        return name_match.group(0) if name_match else "Unknown"
    except Exception as e:
        print(f"Error extracting name: {str(e)}")
        return "Unknown"

def extract_email(text):
    try:
        email_match = re.search(r"[a-zA-Z0-9+_.-]+@[a-zA-Z0-9.-]+", text)
        return email_match.group(0) if email_match else "N/A"
    except Exception as e:
        print(f"Error extracting email: {str(e)}")
        return "N/A"

def extract_contact(text):
    try:
        contact_match = re.search(r"(\+?\d{1,4}[-.\s]?\d{3}[-.\s]?\d{3,4}[-.\s]?\d{4})", text)
        return contact_match.group(0) if contact_match else "N/A"
    except Exception as e:
        print(f"Error extracting contact: {str(e)}")
        return "N/A"

def extract_skills(text):
    try:
        doc = nlp(text)
        nlp_skills = [token.text.lower() for token in doc if token.is_alpha and len(token.text) > 2]
        keywords = kw_model.extract_keywords(text, keyphrase_ngram_range=(1, 2), stop_words='english', top_n=15)
        bert_skills = [kw[0].lower() for kw in keywords]
        skills = list(set(nlp_skills + bert_skills))
        return skills
    except Exception as e:
        print(f"Error extracting skills: {str(e)}")
        return []

def compare_skills(extracted, required_skills):
    try:
        extracted = [skill.lower() for skill in extracted]
        required_skills = [skill.lower() for skill in required_skills]

        matched = [skill for skill in required_skills if skill in extracted]
        missing = [skill for skill in required_skills if skill not in extracted]

        match_score = float((len(matched) / len(required_skills)) * 100) if required_skills else 0.0
        return matched, missing, match_score
    except Exception as e:
        print(f"Error comparing skills: {str(e)}")
        return [], required_skills, 0.0

def analyze_resumes(files, required_skills):
    try:
        results = []
        
        for file in files:
            if file and file.filename.endswith('.pdf'):
                # Save the file temporarily
                file_path = os.path.join("flask_app/uploads", file.filename)
                os.makedirs(os.path.dirname(file_path), exist_ok=True)
                file.save(file_path)

                try:
                    # Extract resume data
                    name, email, contact, skills = extract_resume_data(file_path)
                    matched_skills, missing_skills, match_score = compare_skills(skills, required_skills)
                    
                    # Format the result
                    result = {
                        "id": str(len(results) + 1),
                        "fileName": file.filename,
                        "fileSize": f"{(file.content_length / 1024):.1f} KB",
                        "candidateName": name,
                        "skills": skills,
                        "matchScore": int(match_score),
                        "matchedSkills": matched_skills,
                        "missingSkills": missing_skills
                    }
                    
                    results.append(result)
                finally:
                    # Clean up the file
                    if os.path.exists(file_path):
                        os.remove(file_path)
        
        return results
    except Exception as e:
        print(f"Error in analyze_resumes: {str(e)}")
        return []
    
 
 
 