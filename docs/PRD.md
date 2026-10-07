# Product Requirements Document

## Product
AWS Route53 Clone

## Problem
Users need a functional clone of AWS Route53 for managing Hosted Zones and DNS records, emphasizing UI/UX similarity to the original AWS console without actual DNS resolution capabilities, suitable for learning or prototyping.

## Target Users
Developers, AWS learners, and UI/UX enthusiasts.

## Goal
Build a web application with persistent storage and a backend API that replicates the Route53 user experience and core workflows.

## Core Features
1. **Authentication:** Simple mocked authentication (Login, Logout, Session persistence).
2. **Hosted Zones:** CRUD operations for Hosted Zones (View, Search, Create, Edit, Delete).
3. **DNS Records:** CRUD operations for DNS records within a Hosted Zone (A, AAAA, CNAME, TXT, MX, NS, PTR, SRV, CAA).
4. **Route53 Experience:** Replicate the navigation, tables, forms, search, filters, pagination, modals, and notifications of the real AWS Route53.
5. **Mocked Sections:** "Coming Soon" placeholders for Dashboard, Traffic Policies, Health Checks, Resolver, and Profiles.

## Out of Scope
- Actual DNS functionality (e.g., propagating records to real name servers).
- Real AWS IAM integrations.
- Billing management.

## MVP
- Mock Authentication.
- Hosted Zone List & Creation.
- DNS Record List & Creation within a Zone.
- UI mimicking AWS Route53.
