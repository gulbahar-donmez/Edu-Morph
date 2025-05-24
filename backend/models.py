from database import Base
from sqlalchemy import Column, Integer, String, Boolean, ForeignKey, DateTime, JSON
from sqlalchemy.orm import relationship
from datetime import datetime




class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    first_name = Column(String)
    last_name = Column(String)
    hashed_password = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)
    role = Column(String, default="user")
    phone_number = Column(String, nullable=True)
    is_active = Column(Boolean, default=True)
    learning_style = relationship("LearningStyle", back_populates="user", uselist=False)


    tests = relationship("LearningTest", back_populates="user")
    recommendations = relationship("Recommendation", back_populates="user")
    test_results = relationship("TestResult", back_populates="user")



class LearningTest(Base):
    __tablename__ = "learning_tests"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    test_type = Column(String)
    score = Column(Integer)
    test_date = Column(DateTime, default=datetime.utcnow)


    user = relationship("User", back_populates="tests")



class Recommendation(Base):
    __tablename__ = "recommendations"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    content = Column(String)
    created_at = Column(DateTime, default=datetime.utcnow)


    user = relationship("User", back_populates="recommendations")






class LearningStyle(Base):
    __tablename__ = "learning_styles"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    visual_score = Column(Integer)
    auditory_score = Column(Integer)
    kinesthetic_score = Column(Integer)
    dominant_style = Column(String)
    assessment_date = Column(DateTime, default=datetime.utcnow)
    user = relationship("User", back_populates="learning_style")



class TestResult(Base):
    __tablename__ = "test_results"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    test_type = Column(String)  # learningStyle, personality, career
    results = Column(JSON)
    created_at = Column(DateTime)
    
    user = relationship("User", back_populates="test_results")