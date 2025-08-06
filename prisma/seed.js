// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Starting to seed universities...');

  // Create Universities
  const universities = await Promise.all([
    // Engineering Universities
    prisma.university.create({
      data: {
        name: "Khulna University of Engineering & Technology",
        slug: "kuet",
        departments: {
          create: [
            { name: "Computer Science & Engineering", slug: "cse" },
            { name: "Electrical & Electronic Engineering", slug: "eee" },
            { name: "Electronics & Communication Engineering", slug: "ece" },
            { name: "Civil Engineering", slug: "ce" },
            { name: "Mechanical Engineering", slug: "me" },
            { name: "Industrial Engineering & Management", slug: "iem" },
            { name: "Leather Engineering", slug: "le" },
            { name: "Textile Engineering", slug: "te" },
            { name: "Urban & Regional Planning", slug: "urp" },
            { name: "Building Engineering & Construction Management", slug: "becm" },
            { name: "Architecture", slug: "arch" },
            { name: "Mathematics", slug: "math" },
            { name: "Chemistry", slug: "chem" },
            { name: "Physics", slug: "phy" },
          ]
        }
      }
    }),
    
    prisma.university.create({
      data: {
        name: "Bangladesh University of Engineering & Technology",
        slug: "buet",
        departments: {
          create: [
            { name: "Computer Science & Engineering", slug: "cse" },
            { name: "Electrical & Electronic Engineering", slug: "eee" },
            { name: "Civil Engineering", slug: "ce" },
            { name: "Mechanical Engineering", slug: "me" },
            { name: "Chemical Engineering", slug: "che" },
            { name: "Materials & Metallurgical Engineering", slug: "mme" },
            { name: "Water Resources Engineering", slug: "wre" },
            { name: "Industrial & Production Engineering", slug: "ipe" },
            { name: "Naval Architecture & Marine Engineering", slug: "name" },
            { name: "Architecture", slug: "arch" },
            { name: "Urban & Regional Planning", slug: "urp" },
          ]
        }
      }
    }),

    prisma.university.create({
      data: {
        name: "Chittagong University of Engineering & Technology",
        slug: "cuet",
        departments: {
          create: [
            { name: "Computer Science & Engineering", slug: "cse" },
            { name: "Electrical & Electronic Engineering", slug: "eee" },
            { name: "Electronics & Telecommunication Engineering", slug: "ete" },
            { name: "Civil Engineering", slug: "ce" },
            { name: "Mechanical Engineering", slug: "me" },
            { name: "Petroleum & Mining Engineering", slug: "pme" },
            { name: "Architecture", slug: "arch" },
          ]
        }
      }
    }),

    prisma.university.create({
      data: {
        name: "Rajshahi University of Engineering & Technology",
        slug: "ruet",
        departments: {
          create: [
            { name: "Computer Science & Engineering", slug: "cse" },
            { name: "Electrical & Electronic Engineering", slug: "eee" },
            { name: "Electronics & Telecommunication Engineering", slug: "ete" },
            { name: "Civil Engineering", slug: "ce" },
            { name: "Mechanical Engineering", slug: "me" },
            { name: "Industrial & Production Engineering", slug: "ipe" },
            { name: "Glass & Ceramic Engineering", slug: "gce" },
            { name: "Urban & Regional Planning", slug: "urp" },
          ]
        }
      }
    }),

    // General Universities
    prisma.university.create({
      data: {
        name: "University of Dhaka",
        slug: "du",
        departments: {
          create: [
            { name: "Computer Science & Engineering", slug: "cse" },
            { name: "Electrical & Electronic Engineering", slug: "eee" },
            { name: "Applied Physics & Electronic Engineering", slug: "apee" },
            { name: "Mathematics", slug: "math" },
            { name: "Physics", slug: "physics" },
            { name: "Chemistry", slug: "chemistry" },
            { name: "Statistics", slug: "stat" },
            { name: "Theoretical Physics", slug: "tp" },
          ]
        }
      }
    }),

    prisma.university.create({
      data: {
        name: "Jahangirnagar University",
        slug: "ju",
        departments: {
          create: [
            { name: "Computer Science & Engineering", slug: "cse" },
            { name: "Mathematics", slug: "math" },
            { name: "Physics", slug: "physics" },
            { name: "Chemistry", slug: "chemistry" },
            { name: "Environmental Sciences", slug: "es" },
            { name: "Statistics", slug: "stat" },
          ]
        }
      }
    }),

    // Science & Technology Universities
    prisma.university.create({
      data: {
        name: "Shahjalal University of Science & Technology",
        slug: "sust",
        departments: {
          create: [
            { name: "Computer Science & Engineering", slug: "cse" },
            { name: "Electrical & Electronic Engineering", slug: "eee" },
            { name: "Industrial & Production Engineering", slug: "ipe" },
            { name: "Mechanical Engineering", slug: "me" },
            { name: "Civil & Environmental Engineering", slug: "cee" },
            { name: "Petroleum & Mining Engineering", slug: "pme" },
            { name: "Chemical Engineering & Polymer Science", slug: "cep" },
            { name: "Mathematics", slug: "math" },
            { name: "Physics", slug: "phy" },
            { name: "Chemistry", slug: "che" },
            { name: "Statistics", slug: "sta" },
          ]
        }
      }
    }),
  ]);

  console.log(`Created ${universities.length} universities with departments`);

  // Now let's add some sample courses to CSE departments
  const cseDepartments = await prisma.department.findMany({
    where: { slug: "cse" },
    include: { university: true }
  });

  for (const dept of cseDepartments) {
    await prisma.course.createMany({
      data: [
        { name: "Structured Programming Language", code: "CSE133", slug: "cse133", departmentId: dept.id },
        { name: "Data Structures", code: "CSE135", slug: "cse135", departmentId: dept.id },
        { name: "Object Oriented Programming", code: "CSE213", slug: "cse213", departmentId: dept.id },
        { name: "Algorithms", code: "CSE221", slug: "cse221", departmentId: dept.id },
        { name: "Database Management Systems", code: "CSE311", slug: "cse311", departmentId: dept.id },
        { name: "Operating Systems", code: "CSE313", slug: "cse313", departmentId: dept.id },
        { name: "Computer Networks", code: "CSE315", slug: "cse315", departmentId: dept.id },
        { name: "Software Engineering", code: "CSE317", slug: "cse317", departmentId: dept.id },
        { name: "Artificial Intelligence", code: "CSE411", slug: "cse411", departmentId: dept.id },
        { name: "Machine Learning", code: "CSE413", slug: "cse413", departmentId: dept.id },
      ]
    });
    console.log(`Added courses for CSE department at ${dept.university.name}`);
  }

  // Add a sample question with answer
  const dataStructureCourse = await prisma.course.findFirst({
    where: { code: "CSE135" }
  });

  if (dataStructureCourse) {
    await prisma.question.create({
      data: {
        year: 2023,
        examType: "Final",
        questionNo: 1,
        marks: 10,
        courseId: dataStructureCourse.id,
        content: `## Question 1: Binary Search Tree

Implement a function to check if a binary tree is a valid binary search tree.

\`\`\`c
struct Node {
    int data;
    struct Node* left;
    struct Node* right;
};

bool isBST(struct Node* root) {
    // Write your code here
}
\`\`\`

Explain the time complexity of your solution.`,
        answer: {
          create: {
            content: `## Solution:

We can solve this by checking if each node satisfies the BST property with proper bounds:

\`\`\`c
#include <limits.h>
#include <stdbool.h>

bool isBSTUtil(struct Node* node, int min, int max) {
    // An empty tree is BST
    if (node == NULL)
        return true;
    
    // False if this node violates the min/max constraint
    if (node->data < min || node->data > max)
        return false;
    
    // Otherwise check the subtrees recursively
    // tightening the min or max constraint
    return isBSTUtil(node->left, min, node->data - 1) &&
           isBSTUtil(node->right, node->data + 1, max);
}

bool isBST(struct Node* root) {
    return isBSTUtil(root, INT_MIN, INT_MAX);
}
\`\`\`

**Time Complexity:** $O(n)$ where $n$ is the number of nodes in the tree, as we visit each node exactly once.

**Space Complexity:** $O(h)$ where $h$ is the height of the tree, due to the recursive call stack.`,
            source: "Introduction to Algorithms by Cormen, 3rd Edition, Chapter 12",
            contributor: "Prof. Dr. Mohammad Kaykobad, CSE Department"
          }
        }
      }
    });
    console.log('Added sample question with answer');
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });